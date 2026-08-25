/**
 * Docker — Chương 6: ảnh nhỏ và an toàn.
 * Dựng nhiều tầng · chọn ảnh nền · làm nhỏ · chạy an toàn · quét & chuỗi cung ứng · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 6 — Small and safe images|||Chương 6 — Ảnh nhỏ và an toàn',
  description: 'Cắt một ảnh 1,2GB xuống dưới 200MB mà không bỏ đi thứ gì bạn cần, chọn đúng ảnh nền (và hiểu cái bẫy musl với glibc), chạy không phải root với hệ thống file chỉ đọc, và biết cái ảnh mình đem đi có những lỗ hổng nào.',
  lessons: [
    /* ─────────────────────────── 6.1 ─────────────────────────── */
    {
      title: '6.1 — Multi-stage builds, properly|||6.1 — Dựng nhiều tầng, cho tử tế',
      slug: 'dk-6-1-multi-stage',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một Dockerfile nhiều stage, --target để dừng ở giữa, COPY --from lấy từ stage hay từ một ảnh khác, các stage chạy song song, một biến thể :debug từ cùng một file, và cách bí mật biến mất.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Multi-stage builds, properly</h2>
<p class="lead">A multi-stage build is one Dockerfile with several <code>FROM</code> lines. Each starts a fresh filesystem; only the last one becomes your image; and <code>COPY --from</code> reaches back to pull out exactly what you want. Everything else — the compiler, the dev dependencies, the source code, the secret you needed for one step — is simply not in the result.</p>

<h3>The shape</h3>
<pre><code># syntax=docker/dockerfile:1

FROM node:22-alpine AS build          <span class="tok-comment"># stage 1: has everything</span>
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build                     <span class="tok-comment"># → /app/dist</span>
RUN npm prune --omit=dev              <span class="tok-comment"># strip dev deps in place</span>

FROM node:22-alpine                   <span class="tok-comment"># stage 2: starts EMPTY of stage 1</span>
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]</code></pre>
<pre><code>docker build -t app:multi .
docker build -t app:single -f Dockerfile.single .
docker images app --format '{{.Tag}}\\t{{.Size}}'</code></pre>
<div class="out">multi	196MB
single	1.24GB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">What disappeared</span><span class="v">The TypeScript compiler, 700 dev dependencies, the source tree, the npm cache, and any build tools. None of it was deleted — the second stage simply never had it.</span></div>
  <div class="kv"><span class="k">Deleting would not have worked</span><span class="v"><code>RUN rm -rf src node_modules/.cache</code> in a single-stage build frees nothing, because lower layers are immutable and a delete is a whiteout (Lesson 1.2). A new stage is the only way to actually not ship something.</span></div>
  <div class="kv"><span class="k">The build stage is still cached</span><span class="v">It is a normal set of layers in the build cache, so the next build reuses it. Multi-stage costs nothing in build time — and often saves it, because independent stages run in parallel (Lesson 5.5).</span></div>
  <div class="kv"><span class="k">Smaller means faster deploys</span><span class="v">196MB versus 1.24GB is a pull that takes seconds instead of minutes, on every server, on every deploy. And a smaller attack surface, which Lesson 6.4 makes concrete.</span></div>
</div>

<h3>COPY --from can reach anywhere</h3>
<pre><code><span class="tok-comment"># From a named stage</span>
COPY --from=build /app/dist ./dist

<span class="tok-comment"># From a stage index (works, but fragile — prefer names)</span>
COPY --from=0 /app/dist ./dist

<span class="tok-comment"># From an image that is not a stage at all</span>
COPY --from=nginx:1.27-alpine /etc/nginx/mime.types /etc/nginx/
COPY --from=ghcr.io/jqlang/jq:latest /jq /usr/local/bin/jq

<span class="tok-comment"># From a build context you name on the CLI</span>
docker build --build-context assets=./shared-assets -t app .
<span class="tok-comment"># then in the Dockerfile:</span>
COPY --from=assets logo.svg ./public/</code></pre>
<div class="callout ok"><strong><code>COPY --from=&lt;image&gt;</code> is the neatest way to add a single tool to an image.</strong> Rather than <code>RUN apk add jq</code> — which pulls a package index and its dependencies — you copy one static binary out of an image that already has it. Two lines, a few megabytes, no package manager involved. It works for anything statically linked: <code>jq</code>, <code>dockerize</code>, <code>grpc_health_probe</code>, <code>migrate</code>, <code>tini</code>.</div>

<h3>--target: stop partway</h3>
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

FROM base AS deps
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS dev                      <span class="tok-comment"># ← for local development</span>
COPY . .
CMD ["npm", "run", "dev"]

FROM deps AS test                     <span class="tok-comment"># ← for CI</span>
COPY . .
RUN npm run lint &amp;&amp; npm test

FROM deps AS build
COPY . .
RUN npm run build &amp;&amp; npm prune --omit=dev

FROM node:22-alpine AS prod           <span class="tok-comment"># ← the default: last stage</span>
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]</code></pre>
<pre><code>docker build --target dev   -t app:dev  .
docker build --target test  -t app:test .    <span class="tok-comment"># fails the build if tests fail</span>
docker build                -t app:prod .    <span class="tok-comment"># the last stage</span>
docker images app --format '{{.Tag}} {{.Size}}'</code></pre>
<div class="out">dev 1.19GB
test 1.19GB
prod 196MB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">One file, several outputs</span><span class="v">Development, test and production images from one Dockerfile that cannot drift apart. Compose picks a target with <code>build: { target: dev }</code> (Chapter 9).</span></div>
  <div class="kv"><span class="k">Tests as a build stage</span><span class="v">A failing test fails the build, so a broken image cannot be produced at all. Note the trade-off: it also means you cannot build the image to debug why the tests failed — use <code>--target deps</code> for that.</span></div>
  <div class="kv"><span class="k">Stages inherit from stages</span><span class="v"><code>FROM deps AS dev</code> starts from the <code>deps</code> stage, not from a registry image. That is how <code>base</code> and <code>deps</code> are shared by everything below without repeating themselves.</span></div>
  <div class="kv"><span class="k">Unused stages are skipped</span><span class="v"><code>--target dev</code> never runs the <code>build</code> or <code>test</code> stages at all — BuildKit only executes what the target depends on. So extra stages cost nothing when you do not ask for them.</span></div>
</div>

<h3>A :debug variant of the same image</h3>
<pre><code>FROM gcr.io/distroless/nodejs22-debian12 AS prod
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
CMD ["/app/dist/index.js"]

FROM node:22-alpine AS prod-debug       <span class="tok-comment"># same content, plus a shell</span>
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
RUN apk add --no-cache curl jq
CMD ["node", "/app/dist/index.js"]</code></pre>
<pre><code>docker build --target prod       -t app:1.4.2 .
docker build --target prod-debug -t app:1.4.2-debug .</code></pre>
<div class="callout"><strong>This is the answer to "distroless is great until something breaks".</strong> Ship <code>prod</code>, which has no shell and no package manager for an attacker to use. Keep <code>prod-debug</code> built from the same artifacts, and when you need to look inside, run that instead — or use the sidecar technique from Lesson 2.3. What you must not do is add a shell to the production image "just in case"; that is trading a permanent weakness for an occasional convenience you have a better answer for.</div>

<h3>Secrets really do disappear</h3>
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./     <span class="tok-comment"># private registry token</span>
RUN npm ci &amp;&amp; rm .npmrc
COPY . .
RUN npm run build

FROM node:22-alpine
COPY --from=build /app/dist ./dist                <span class="tok-comment"># ONLY dist is copied</span>
CMD ["node", "dist/index.js"]</code></pre>
<pre><code>docker save app:multi | tar -xO --wildcards '*/layer.tar' 2&gt;/dev/null \\
  | tar -t 2&gt;/dev/null | grep -c npmrc</code></pre>
<div class="out">0</div>
<p>The <code>.npmrc</code> exists in a layer of the <em>build</em> stage — which is never published, because only the final stage's layers are exported. That is a genuine improvement over single-stage, where <code>rm .npmrc</code> leaves the file in an earlier layer (Lesson 1.2). It is still not the best answer: <code>RUN --mount=type=secret</code> keeps the value out of <em>every</em> layer including the build stage's, and out of the build cache you might export to a registry (Lesson 5.4). Use the mount when you can, and multi-stage as the fallback.</p>

<h3>What to put where</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Build stage: everything</span><span class="lz-t">compilers, dev dependencies, source, test fixtures, secrets</span><span class="lz-d">Size does not matter here at all. Optimise this stage for cache hits (Chapter 5), not for bytes.</span></div>
  <div class="lz-step"><span class="lz-k">Final stage: the runtime and the artifact</span><span class="lz-t">the interpreter or nothing, plus dist/ and production node_modules</span><span class="lz-d">Ask of every line: does the running process need this? If not, it belongs in an earlier stage.</span></div>
  <div class="lz-step"><span class="lz-k">Never COPY . . into the final stage</span><span class="lz-t">it undoes the whole exercise</span><span class="lz-d">Copy named artifacts from named stages. A <code>COPY . .</code> at the end brings the source tree, the tests and the <code>.env</code> back in.</span></div>
  <div class="lz-step"><span class="lz-k">Put USER, ENV and CMD last</span><span class="lz-t">after the COPYs that need root</span><span class="lz-d">They are free metadata and belong where they are easiest to read (Lesson 4.2).</span></div>
  <div class="lz-step"><span class="lz-k">Name every stage</span><span class="lz-t">AS base, AS deps, AS build, AS prod</span><span class="lz-d">Indexes break when you insert a stage; names do not, and they make <code>--target</code> and <code>--cache-from</code> readable.</span></div>
</div>

<a class="link-card" href="https://docs.docker.com/build/building/multi-stage/" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">Multi-stage builds</span><span class="lc-sub">The official guide: naming stages, stopping at a target, copying from external images, and the differences from the old builder-pattern workaround.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/context/#named-contexts" target="_blank" rel="noopener">
  <span class="lc-ico">📎</span>
  <span class="lc-body"><span class="lc-title">Named build contexts</span><span class="lc-sub"><code>--build-context name=path</code> — how to bring in a directory outside your context, or pin a stage to a specific image at build time without editing the Dockerfile.</span></span>
</a>
<a class="link-card" href="https://github.com/wagoodman/dive" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">dive</span><span class="lc-sub">Browse the final image layer by layer and confirm nothing from the build stage leaked in. The fastest way to check that a multi-stage refactor did what you think.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: split the stages</span><span class="lc-sub">Graded exercises: convert a 1.2GB single-stage image to multi-stage and measure, add a <code>test</code> stage that fails the build, produce a <code>:debug</code> variant, and prove a secret is absent from the published layers.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> copying <code>node_modules</code> from the build stage without pruning it first. The build stage installed <em>everything</em>, so <code>COPY --from=build /app/node_modules</code> brings 700 dev dependencies into your production image and the multi-stage build saves you almost nothing. Two fixes: run <code>npm prune --omit=dev</code> at the end of the build stage, or keep a separate <code>deps</code> stage that only ever ran <code>npm ci --omit=dev</code> and copy from that one. The same trap exists for Python (<code>pip install --prefix=/install</code> in the build stage) and for anything where the build and runtime dependency sets differ.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A later <code>FROM</code> starts a completely fresh filesystem, so things you do not copy forward are not in the image — which is the only reliable way to <em>not</em> ship something, since deleting leaves a whiteout. <code>COPY --from</code> reaches into a named stage, an external image or a named context, which makes adding a single static binary a two-line operation. And name every stage: it makes <code>--target</code> readable, survives insertions, and lets one Dockerfile produce dev, test, prod and debug images that cannot drift apart.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Dựng nhiều tầng, cho tử tế</h2>
<p class="lead">Một lượt dựng nhiều tầng là MỘT Dockerfile với NHIỀU dòng <code>FROM</code>. Mỗi cái bắt đầu một hệ thống file mới tinh; chỉ cái cuối cùng trở thành ảnh của bạn; và <code>COPY --from</code> với ngược lại lôi ra đúng thứ bạn muốn. Mọi thứ khác — trình biên dịch, thư viện dev, mã nguồn, cái bí mật bạn cần cho một bước — đơn giản là KHÔNG có mặt trong kết quả.</p>

<h3>Hình hài</h3>
<pre><code># syntax=docker/dockerfile:1

FROM node:22-alpine AS build          <span class="tok-comment"># stage 1: có tất cả</span>
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build                     <span class="tok-comment"># → /app/dist</span>
RUN npm prune --omit=dev              <span class="tok-comment"># cắt thư viện dev tại chỗ</span>

FROM node:22-alpine                   <span class="tok-comment"># stage 2: bắt đầu TRỐNG so với stage 1</span>
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]</code></pre>
<pre><code>docker build -t app:multi .
docker build -t app:single -f Dockerfile.single .
docker images app --format '{{.Tag}}\\t{{.Size}}'</code></pre>
<div class="out">multi	196MB
single	1.24GB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Thứ đã biến mất</span><span class="v">Trình biên dịch TypeScript, 700 thư viện dev, cây mã nguồn, bộ đệm npm, và mọi công cụ dựng. Không cái nào bị XOÁ cả — stage thứ hai đơn giản là CHƯA BAO GIỜ CÓ chúng.</span></div>
  <div class="kv"><span class="k">Xoá đi thì đã không được</span><span class="v"><code>RUN rm -rf src node_modules/.cache</code> trong một lượt dựng một tầng chẳng giải phóng được gì, vì tầng dưới là bất biến và một lần xoá chỉ là một whiteout (Bài 1.2). Một stage mới là cách DUY NHẤT để thật sự không đem theo một thứ gì đó.</span></div>
  <div class="kv"><span class="k">Stage dựng vẫn nằm trong cache</span><span class="v">Nó là một bộ tầng bình thường trong bộ đệm dựng, nên lượt dựng sau dùng lại nó. Dựng nhiều tầng KHÔNG tốn thêm thời gian dựng — và thường còn tiết kiệm, vì các stage độc lập chạy song song (Bài 5.5).</span></div>
  <div class="kv"><span class="k">Nhỏ hơn nghĩa là deploy nhanh hơn</span><span class="v">196MB so với 1,24GB là một lượt kéo mất vài giây thay vì vài phút, trên mọi máy chủ, ở mọi bản deploy. Và một bề mặt tấn công nhỏ hơn, thứ mà Bài 6.4 cụ thể hoá.</span></div>
</div>

<h3>COPY --from với tới được mọi nơi</h3>
<pre><code><span class="tok-comment"># Từ một stage có tên</span>
COPY --from=build /app/dist ./dist

<span class="tok-comment"># Từ chỉ số của stage (chạy được, nhưng dễ vỡ — nên dùng TÊN)</span>
COPY --from=0 /app/dist ./dist

<span class="tok-comment"># Từ một cái ảnh hoàn toàn không phải stage nào</span>
COPY --from=nginx:1.27-alpine /etc/nginx/mime.types /etc/nginx/
COPY --from=ghcr.io/jqlang/jq:latest /jq /usr/local/bin/jq

<span class="tok-comment"># Từ một ngữ cảnh dựng bạn đặt tên trên dòng lệnh</span>
docker build --build-context assets=./shared-assets -t app .
<span class="tok-comment"># rồi trong Dockerfile:</span>
COPY --from=assets logo.svg ./public/</code></pre>
<div class="callout ok"><strong><code>COPY --from=&lt;ảnh&gt;</code> là cách gọn gàng nhất để thêm MỘT công cụ vào một cái ảnh.</strong> Thay vì <code>RUN apk add jq</code> — thứ kéo về một danh mục gói cùng đám phụ thuộc của nó — bạn chép MỘT chương trình tĩnh ra khỏi một cái ảnh vốn đã có nó. Hai dòng, vài megabyte, không dính tới trình quản lý gói nào. Nó chạy với mọi thứ liên kết tĩnh: <code>jq</code>, <code>dockerize</code>, <code>grpc_health_probe</code>, <code>migrate</code>, <code>tini</code>.</div>

<h3>--target: dừng lại giữa chừng</h3>
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

FROM base AS deps
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS dev                      <span class="tok-comment"># ← để phát triển cục bộ</span>
COPY . .
CMD ["npm", "run", "dev"]

FROM deps AS test                     <span class="tok-comment"># ← cho CI</span>
COPY . .
RUN npm run lint &amp;&amp; npm test

FROM deps AS build
COPY . .
RUN npm run build &amp;&amp; npm prune --omit=dev

FROM node:22-alpine AS prod           <span class="tok-comment"># ← mặc định: stage cuối</span>
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]</code></pre>
<pre><code>docker build --target dev   -t app:dev  .
docker build --target test  -t app:test .    <span class="tok-comment"># test hỏng thì lượt dựng hỏng</span>
docker build                -t app:prod .    <span class="tok-comment"># stage cuối</span>
docker images app --format '{{.Tag}} {{.Size}}'</code></pre>
<div class="out">dev 1.19GB
test 1.19GB
prod 196MB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Một file, nhiều đầu ra</span><span class="v">Ảnh phát triển, ảnh test và ảnh production từ MỘT Dockerfile không thể lệch nhau. Compose chọn một target bằng <code>build: { target: dev }</code> (Chương 9).</span></div>
  <div class="kv"><span class="k">Test làm một stage dựng</span><span class="v">Một test hỏng thì lượt dựng hỏng, nên một cái ảnh hỏng hoàn toàn không được tạo ra. Chú ý cái đánh đổi: nó cũng nghĩa là bạn không dựng được cái ảnh để gỡ lỗi xem vì sao test hỏng — hãy dùng <code>--target deps</code> cho việc đó.</span></div>
  <div class="kv"><span class="k">Stage kế thừa từ stage</span><span class="v"><code>FROM deps AS dev</code> bắt đầu từ stage <code>deps</code>, không phải từ một ảnh trong registry. Đó là cách <code>base</code> và <code>deps</code> được dùng chung bởi mọi thứ bên dưới mà không phải lặp lại.</span></div>
  <div class="kv"><span class="k">Stage không dùng tới thì bị BỎ QUA</span><span class="v"><code>--target dev</code> hoàn toàn không chạy stage <code>build</code> hay <code>test</code> — BuildKit chỉ thực thi những gì cái target phụ thuộc vào. Nên các stage thừa không tốn gì khi bạn không yêu cầu chúng.</span></div>
</div>

<h3>Một biến thể :debug từ cùng cái ảnh</h3>
<pre><code>FROM gcr.io/distroless/nodejs22-debian12 AS prod
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
CMD ["/app/dist/index.js"]

FROM node:22-alpine AS prod-debug       <span class="tok-comment"># cùng nội dung, thêm một cái shell</span>
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
RUN apk add --no-cache curl jq
CMD ["node", "/app/dist/index.js"]</code></pre>
<pre><code>docker build --target prod       -t app:1.4.2 .
docker build --target prod-debug -t app:1.4.2-debug .</code></pre>
<div class="callout"><strong>Đây là câu trả lời cho "distroless thì tuyệt cho tới khi có thứ gì hỏng".</strong> Hãy đem đi bản <code>prod</code>, thứ không có shell và không có trình quản lý gói nào cho kẻ tấn công dùng. Giữ lại <code>prod-debug</code> dựng từ CÙNG những hiện vật đó, và khi cần nhìn vào bên trong thì chạy cái đó — hoặc dùng kỹ thuật container phụ ở Bài 2.3. Thứ bạn KHÔNG được làm là thêm một cái shell vào ảnh production "để phòng khi cần"; đó là đánh đổi một điểm yếu vĩnh viễn lấy một sự tiện lợi thi thoảng mà bạn vốn đã có câu trả lời tốt hơn.</div>

<h3>Bí mật thật sự biến mất</h3>
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./     <span class="tok-comment"># token registry riêng</span>
RUN npm ci &amp;&amp; rm .npmrc
COPY . .
RUN npm run build

FROM node:22-alpine
COPY --from=build /app/dist ./dist                <span class="tok-comment"># CHỈ dist được chép</span>
CMD ["node", "dist/index.js"]</code></pre>
<pre><code>docker save app:multi | tar -xO --wildcards '*/layer.tar' 2&gt;/dev/null \\
  | tar -t 2&gt;/dev/null | grep -c npmrc</code></pre>
<div class="out">0</div>
<p>File <code>.npmrc</code> có tồn tại trong một tầng của stage <em>DỰNG</em> — và stage đó không bao giờ được công bố, vì chỉ những tầng của stage CUỐI mới được xuất ra. Đó là một cải thiện có thật so với một tầng, nơi <code>rm .npmrc</code> để lại cái file trong một tầng trước đó (Bài 1.2). Nó vẫn chưa phải câu trả lời tốt nhất: <code>RUN --mount=type=secret</code> giữ giá trị đó nằm ngoài <em>MỌI</em> tầng kể cả của stage dựng, và nằm ngoài cả cái cache dựng mà bạn có thể xuất lên registry (Bài 5.4). Hãy dùng cái mount khi có thể, và dùng nhiều tầng làm phương án dự phòng.</p>

<h3>Đặt cái gì vào đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Stage dựng: mọi thứ</span><span class="lz-t">trình biên dịch, thư viện dev, mã nguồn, dữ liệu test, bí mật</span><span class="lz-d">Kích thước ở đây hoàn toàn không quan trọng. Hãy tối ưu stage này cho việc TRÚNG CACHE (Chương 5), không phải cho số byte.</span></div>
  <div class="lz-step"><span class="lz-k">Stage cuối: môi trường chạy và hiện vật</span><span class="lz-t">trình thông dịch hoặc không gì cả, cộng dist/ và node_modules production</span><span class="lz-d">Hãy hỏi ở mọi dòng: tiến trình đang chạy có CẦN cái này không? Không thì nó thuộc về một stage trước đó.</span></div>
  <div class="lz-step"><span class="lz-k">Đừng bao giờ COPY . . vào stage cuối</span><span class="lz-t">nó phá tan toàn bộ bài tập này</span><span class="lz-d">Hãy chép những hiện vật CÓ TÊN từ những stage CÓ TÊN. Một lệnh <code>COPY . .</code> ở cuối sẽ lôi cây mã nguồn, đám test và cái <code>.env</code> quay trở lại.</span></div>
  <div class="lz-step"><span class="lz-k">Đặt USER, ENV và CMD sau cùng</span><span class="lz-t">sau những lệnh COPY cần quyền root</span><span class="lz-d">Chúng là siêu dữ liệu miễn phí và thuộc về chỗ dễ đọc nhất (Bài 4.2).</span></div>
  <div class="lz-step"><span class="lz-k">Đặt TÊN cho mọi stage</span><span class="lz-t">AS base, AS deps, AS build, AS prod</span><span class="lz-d">Chỉ số vỡ khi bạn chèn thêm một stage; tên thì không, và tên làm cho <code>--target</code> với <code>--cache-from</code> đọc được.</span></div>
</div>

<a class="link-card" href="https://docs.docker.com/build/building/multi-stage/" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">Dựng nhiều tầng</span><span class="lc-sub">Hướng dẫn chính thức: đặt tên stage, dừng ở một target, chép từ ảnh bên ngoài, và khác biệt so với cái mẹo builder-pattern thời trước.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/context/#named-contexts" target="_blank" rel="noopener">
  <span class="lc-ico">📎</span>
  <span class="lc-body"><span class="lc-title">Ngữ cảnh dựng có tên</span><span class="lc-sub"><code>--build-context tên=đường/dẫn</code> — cách đưa vào một thư mục nằm ngoài ngữ cảnh, hoặc ghim một stage vào một ảnh cụ thể lúc dựng mà không phải sửa Dockerfile.</span></span>
</a>
<a class="link-card" href="https://github.com/wagoodman/dive" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">dive</span><span class="lc-sub">Duyệt ảnh cuối theo từng tầng và xác nhận không có gì từ stage dựng lọt vào. Cách nhanh nhất để kiểm rằng một lượt tái cấu trúc nhiều tầng đã làm đúng thứ bạn nghĩ.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: tách các stage ra</span><span class="lc-sub">Bài chấm điểm: chuyển một ảnh một tầng 1,2GB sang nhiều tầng rồi đo, thêm một stage <code>test</code> làm hỏng lượt dựng, tạo một biến thể <code>:debug</code>, và chứng minh một bí mật vắng mặt khỏi những tầng đã công bố.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> chép <code>node_modules</code> từ stage dựng mà chưa tỉa nó. Stage dựng đã cài <em>MỌI THỨ</em>, nên <code>COPY --from=build /app/node_modules</code> lôi 700 thư viện dev vào ảnh production của bạn và lượt dựng nhiều tầng gần như chẳng tiết kiệm được gì. Hai cách chữa: chạy <code>npm prune --omit=dev</code> ở cuối stage dựng, hoặc giữ một stage <code>deps</code> riêng vốn chỉ từng chạy <code>npm ci --omit=dev</code> rồi chép từ cái đó. Cùng cái bẫy tồn tại với Python (<code>pip install --prefix=/install</code> trong stage dựng) và với mọi thứ mà bộ thư viện lúc dựng khác bộ thư viện lúc chạy.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Một lệnh <code>FROM</code> phía sau bắt đầu một hệ thống file HOÀN TOÀN MỚI, nên những thứ bạn không chép sang thì không có trong ảnh — và đó là cách đáng tin duy nhất để KHÔNG đem theo một thứ gì đó, vì xoá chỉ để lại một whiteout. <code>COPY --from</code> với được vào một stage có tên, một ảnh bên ngoài hoặc một ngữ cảnh có tên, và điều đó biến việc thêm MỘT chương trình tĩnh thành một thao tác hai dòng. Và hãy đặt TÊN cho mọi stage: nó làm <code>--target</code> đọc được, sống sót qua việc chèn thêm, và cho phép một Dockerfile sinh ra ảnh dev, test, prod và debug không thể lệch nhau.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — Choosing a base image, and the musl trap|||6.2 — Chọn ảnh nền, và cái bẫy musl',
      slug: 'dk-6-2-chon-anh-nen',
      type: 'LESSON',
      description: 'So kích thước thật của full, slim, alpine, distroless và scratch; musl khác glibc ở đâu và nó phá cái gì; vì sao Prisma với wheel Python hay vỡ trên Alpine; và một bảng chọn dứt khoát.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Choosing a base image, and the musl trap</h2>
<p class="lead">The base image decides most of your image size, most of your vulnerability count, and — through one detail almost nobody mentions until it bites — whether your native dependencies work at all. This lesson measures the options and then spends most of its length on the detail: Alpine uses a different C library from everything else.</p>

<h3>The sizes, measured</h3>
<pre><code>for t in 22 22-slim 22-alpine; do docker pull -q node:\$t &gt;/dev/null; done
docker pull -q gcr.io/distroless/nodejs22-debian12 &gt;/dev/null
docker images --format '{{.Repository}}:{{.Tag}}\\t{{.Size}}' \\
  | grep -E 'node|distroless' | sort -k2 -hr</code></pre>
<div class="out">node:22	1.13GB
node:22-slim	224MB
gcr.io/distroless/nodejs22-debian12:latest	152MB
node:22-alpine	185MB</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">node:22 — the full image (1.13GB)</span><span class="lz-lnote">Debian with build-essential, git, curl, python3 and a full toolchain. Right as a <strong>build stage</strong>, where you want compilers available and size is irrelevant. Almost never right as a final image.</span></div>
  <div class="lz-layer"><span class="lz-lname">node:22-slim — Debian, trimmed (224MB)</span><span class="lz-lnote">Same glibc-based Debian, with docs, man pages and the toolchain removed. The <strong>safe default</strong> for a final image: everything works exactly as it does on a normal Linux, and it is only 40MB more than Alpine.</span></div>
  <div class="lz-layer"><span class="lz-lname">node:22-alpine — musl (185MB)</span><span class="lz-lnote">Smallest of the ones with a shell and a package manager, and the source of every problem in the rest of this lesson. Excellent when your dependencies are pure JavaScript; a trap when they are not.</span></div>
  <div class="lz-layer"><span class="lz-lname">distroless — runtime only (152MB)</span><span class="lz-lnote">glibc, the Node runtime, CA certificates. No shell, no package manager, no <code>ls</code>. Smallest sensible option for a Node app and the best security posture, at the cost of needing Lesson 2.3's debugging techniques.</span></div>
  <div class="lz-layer"><span class="lz-lname">scratch — nothing at all (0 bytes)</span><span class="lz-lnote">Only for a fully static binary: Go with <code>CGO_ENABLED=0</code>, Rust with musl. Note it has no CA certificates, so any HTTPS call fails until you <code>COPY --from</code> them in.</span></div>
</div>

<h3>musl versus glibc: the actual difference</h3>
<pre><code>docker run --rm node:22-slim   sh -c 'ldd --version 2&gt;&amp;1 | head -1'
docker run --rm node:22-alpine sh -c 'ldd 2&gt;&amp;1 | head -1'
docker run --rm node:22-slim   sh -c 'ls /lib/x86_64-linux-gnu/libc.so.6'
docker run --rm node:22-alpine sh -c 'ls /lib/ld-musl-x86_64.so.1'</code></pre>
<div class="out">ldd (Debian GLIBC 2.36-9+deb12u8) 2.36
musl libc (x86_64)
/lib/x86_64-linux-gnu/libc.so.6
/lib/ld-musl-x86_64.so.1</div>
<p>Alpine uses <strong>musl</strong>, a small clean-room C library. Debian, Ubuntu, RHEL and every distroless variant use <strong>glibc</strong>. Both implement the same standard; they are not binary-compatible. A compiled shared object built against glibc will not load on musl, and the error message is usually unhelpful.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Prebuilt native modules</span><span class="v">npm packages ship prebuilt binaries for <code>linux-x64-glibc</code>. On Alpine, either a musl build exists and is downloaded, or npm falls back to compiling from source — which needs <code>python3 make g++</code> in the image and takes minutes.</span></div>
  <div class="kv"><span class="k">Python wheels</span><span class="v">PyPI wheels are <code>manylinux</code>, which means glibc. On Alpine, <code>pip install</code> compiles <em>everything</em> from source: numpy, pandas, cryptography, psycopg2. A 20-second install becomes 10 minutes, and sometimes fails. This is why Lesson 4.5 says <code>python:3.12-slim</code>, not alpine.</span></div>
  <div class="kv"><span class="k">Prisma engines</span><span class="v">Prisma downloads a query engine binary matched to the platform. Alpine needs <code>binaryTargets = ["linux-musl-openssl-3.0.x"]</code> in <code>schema.prisma</code>; get it wrong and the container starts, connects to nothing, and restarts forever.</span></div>
  <div class="kv"><span class="k">DNS behaves differently</span><span class="v">musl's resolver queries all nameservers in parallel and historically had gaps in <code>search</code>-domain and TCP fallback handling. Symptom: intermittent DNS failures inside Kubernetes that vanish on a Debian base.</span></div>
  <div class="kv"><span class="k">Performance</span><span class="v">musl's malloc is simpler and slower under heavy multithreaded allocation. For most web apps it is unmeasurable; for allocation-heavy workloads it has been measured at double-digit percentages.</span></div>
</div>
<div class="callout warn"><strong>This project's own outage was exactly this.</strong> A deploy script built with the default <code>Dockerfile</code> instead of <code>Dockerfile.backend</code>, which put a <code>debian-openssl-3.0.x</code> Prisma engine — glibc — onto a <code>node:22-alpine</code> base. The build was green, the push was green, the swap was green, and then the backend restarted forever and the API returned 502 for seven minutes. The lesson recorded afterwards was: <em>a green build does not mean a runnable image</em>. A libc-versus-engine check now runs before the push.</div>
<pre><code><span class="tok-comment"># Detect the mismatch before it reaches production</span>
docker run --rm --entrypoint sh app:latest -c '
  echo -n "libc: "; ( ldd --version 2&gt;&amp;1 | head -1 ) || true
  echo -n "prisma engines: "; ls node_modules/.prisma/client/ 2&gt;/dev/null | grep -o "engine.*" | head -2
'</code></pre>
<div class="out">libc: musl libc (x86_64)
prisma engines: libquery_engine-linux-musl-openssl-3.0.x.so.node</div>

<h3>When each base is right</h3>
<div class="lz-map">
  <div class="lz-stage">Use -slim (Debian)</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The default for a final image</span><span class="lz-nsub">Anything with native modules, Python, Prisma, or an unfamiliar dependency tree. Costs about 40MB over Alpine and removes a whole class of problem. If you are not sure, this is the answer.</span></div></div>
  <div class="lz-stage">Use -alpine</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Pure-JS dependencies, or you have verified it</span><span class="lz-nsub">A Node API with no compiled modules, an nginx image, a small Go tool that wants a shell. Verify with a real run, not a green build.</span></div></div>
  <div class="lz-stage">Use distroless</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Production, once the app is stable</span><span class="lz-nsub">glibc, so no musl surprises; no shell, so a much smaller attack surface; and a <code>:debug</code> sibling from the same Dockerfile for when you need to look (Lesson 6.1).</span></div></div>
  <div class="lz-stage">Use scratch</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A single static binary, nothing else</span><span class="lz-nsub">Go or Rust. Remember CA certificates and timezone data are absent — copy them from a real image if the program needs them.</span></div></div>
  <div class="lz-stage">Use the full image</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">As a build stage only</span><span class="lz-nsub">Compilers already present, nothing to install, and its size never reaches the final image (Lesson 6.1).</span></div></div>
</div>

<h3>Reading a base image's real cost</h3>
<pre><code>docker scout quickview node:22-slim 2&gt;/dev/null | head -8
docker scout quickview node:22-alpine 2&gt;/dev/null | head -6</code></pre>
<div class="out">  Target             │  node:22-slim         │    0C     2H     8M    41L
    digest           │  a1b2c3d4e5f6         │
  Base image         │  debian:bookworm-slim │    0C     0H     2M    31L

  Target             │  node:22-alpine       │    0C     0H     1M     6L
    digest           │  9f8e7d6c5b4a         │
  Base image         │  alpine:3.20          │    0C     0H     0M     3L</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Alpine genuinely has fewer CVEs</span><span class="v">Because it has far fewer packages. That is a real advantage and it is why the security-minded reach for it — but count the ones that actually apply to your process, not the raw total.</span></div>
  <div class="kv"><span class="k">Most low-severity findings are unreachable</span><span class="v">A CVE in <code>libtiff</code> in an image that never decodes an image is not a risk you have. Lesson 6.5 covers triaging rather than counting.</span></div>
  <div class="kv"><span class="k">Distroless is the real winner here</span><span class="v">Fewer packages than Alpine <em>and</em> glibc. If the CVE count is what you are optimising, distroless beats both.</span></div>
  <div class="kv"><span class="k">The number moves without you</span><span class="v">A base image's CVE count grows as new ones are published against packages it already had. A rebuild cadence matters more than the number on the day you chose (Lesson 3.2).</span></div>
</div>

<h3>Pinning the base</h3>
<pre><code><span class="tok-comment"># Good: minor version + variant, patches still arrive</span>
FROM node:22-alpine

<span class="tok-comment"># Better: also pin the Alpine or Debian release, so a base OS bump is deliberate</span>
FROM node:22-alpine3.20
FROM python:3.12-bookworm

<span class="tok-comment"># Best for production: readable tag AND immutable digest (Lesson 3.2)</span>
FROM node:22-alpine3.20@sha256:b8f2c1a4e9d3f7a6b5c4d3e2f1908877665544332211aabbccddeeff0011223344</code></pre>
<div class="callout ok"><strong>Pin the OS release, not just the language version.</strong> <code>node:22-alpine</code> silently moved from Alpine 3.19 to 3.20 to 3.21 over a year, and each move changes system library versions underneath you. <code>node:22-alpine3.20</code> keeps that stable until you choose otherwise — which turns "our build broke and nothing changed" into a decision you make on purpose.</div>

<a class="link-card" href="https://hub.docker.com/_/node" target="_blank" rel="noopener">
  <span class="lc-ico">🟩</span>
  <span class="lc-body"><span class="lc-title">The official node image documentation</span><span class="lc-sub">The tag list explained — what <code>-slim</code>, <code>-alpine</code> and the bare tags contain — plus the maintainers' own notes on when Alpine is a bad idea.</span></span>
</a>
<a class="link-card" href="https://wiki.musl-libc.org/functional-differences-from-glibc.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">musl — functional differences from glibc</span><span class="lc-sub">The maintainers' own list, including the DNS resolver behaviour and the stack-size default that breaks some threaded programs. The primary source when Alpine behaves oddly.</span></span>
</a>
<a class="link-card" href="https://github.com/GoogleContainerTools/distroless" target="_blank" rel="noopener">
  <span class="lc-ico">🪶</span>
  <span class="lc-body"><span class="lc-title">distroless</span><span class="lc-sub">Which variant contains what, the <code>:nonroot</code> and <code>:debug</code> tags, and worked examples per language. Read before your first distroless image.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: pick the base</span><span class="lc-sub">Graded exercises: choose a base for four different applications and justify it, diagnose a native module that fails only on Alpine, detect a libc/engine mismatch before deploying, and pin a base three ways.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> switching to Alpine "to make the image smaller" and shipping it because the build passed. The install step succeeds — npm found a musl prebuild, or silently compiled from source — and the failure appears at run time, on the server, as a module that will not load or an engine that cannot start. Worse, some libraries degrade instead of failing: a slightly different DNS resolver produces intermittent lookup failures under load that never reproduce locally. The rule: changing the base image is a change that needs a real run, not a green build. Start the container, hit a real endpoint, and check the logs — and if the app uses Prisma, native modules or Python wheels, budget an afternoon or just use <code>-slim</code>.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Alpine uses musl and everything else uses glibc; they are not binary-compatible, which is why native modules, Python wheels and Prisma engines break there specifically. <code>-slim</code> is the safe default for a final image — about 40MB more than Alpine and none of the surprises — and distroless is the better production answer once the app is stable. And pin the OS release in the tag, not just the language version, so a base OS bump is a decision rather than an incident.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Chọn ảnh nền, và cái bẫy musl</h2>
<p class="lead">Ảnh nền quyết định phần lớn kích thước ảnh của bạn, phần lớn số lỗ hổng, và — qua một chi tiết mà gần như chẳng ai nhắc tới cho tới lúc nó cắn — quyết định luôn cả việc thư viện native của bạn có chạy được hay không. Bài này ĐO các lựa chọn rồi dành phần lớn độ dài cho cái chi tiết đó: Alpine dùng một thư viện C KHÁC với mọi thứ còn lại.</p>

<h3>Kích thước, đo thật</h3>
<pre><code>for t in 22 22-slim 22-alpine; do docker pull -q node:\$t &gt;/dev/null; done
docker pull -q gcr.io/distroless/nodejs22-debian12 &gt;/dev/null
docker images --format '{{.Repository}}:{{.Tag}}\\t{{.Size}}' \\
  | grep -E 'node|distroless' | sort -k2 -hr</code></pre>
<div class="out">node:22	1.13GB
node:22-slim	224MB
gcr.io/distroless/nodejs22-debian12:latest	152MB
node:22-alpine	185MB</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">node:22 — ảnh đầy đủ (1,13GB)</span><span class="lz-lnote">Debian kèm build-essential, git, curl, python3 và trọn bộ công cụ biên dịch. Đúng khi làm <strong>STAGE DỰNG</strong>, nơi bạn muốn có sẵn trình biên dịch và kích thước không quan trọng. Gần như không bao giờ đúng khi làm ảnh cuối.</span></div>
  <div class="lz-layer"><span class="lz-lname">node:22-slim — Debian đã tỉa (224MB)</span><span class="lz-lnote">Vẫn Debian nền glibc, đã gỡ tài liệu, trang man và bộ công cụ biên dịch. <strong>MẶC ĐỊNH AN TOÀN</strong> cho một ảnh cuối: mọi thứ chạy đúng như trên một máy Linux bình thường, và nó chỉ nặng hơn Alpine 40MB.</span></div>
  <div class="lz-layer"><span class="lz-lname">node:22-alpine — musl (185MB)</span><span class="lz-lnote">Nhỏ nhất trong nhóm còn có shell và trình quản lý gói, và là nguồn gốc của mọi vấn đề trong phần còn lại của bài này. Tuyệt vời khi thư viện của bạn thuần JavaScript; là cái bẫy khi không phải vậy.</span></div>
  <div class="lz-layer"><span class="lz-lname">distroless — chỉ môi trường chạy (152MB)</span><span class="lz-lnote">glibc, môi trường chạy Node, chứng chỉ CA. Không shell, không trình quản lý gói, không cả <code>ls</code>. Lựa chọn nhỏ nhất hợp lý cho một ứng dụng Node và tư thế an ninh tốt nhất, đổi lại là cần tới kỹ thuật gỡ lỗi ở Bài 2.3.</span></div>
  <div class="lz-layer"><span class="lz-lname">scratch — không có gì cả (0 byte)</span><span class="lz-lnote">Chỉ dành cho một chương trình tĩnh hoàn toàn: Go với <code>CGO_ENABLED=0</code>, Rust với musl. Lưu ý nó KHÔNG có chứng chỉ CA, nên mọi lời gọi HTTPS đều hỏng cho tới khi bạn <code>COPY --from</code> chúng vào.</span></div>
</div>

<h3>musl so với glibc: khác biệt THẬT</h3>
<pre><code>docker run --rm node:22-slim   sh -c 'ldd --version 2&gt;&amp;1 | head -1'
docker run --rm node:22-alpine sh -c 'ldd 2&gt;&amp;1 | head -1'
docker run --rm node:22-slim   sh -c 'ls /lib/x86_64-linux-gnu/libc.so.6'
docker run --rm node:22-alpine sh -c 'ls /lib/ld-musl-x86_64.so.1'</code></pre>
<div class="out">ldd (Debian GLIBC 2.36-9+deb12u8) 2.36
musl libc (x86_64)
/lib/x86_64-linux-gnu/libc.so.6
/lib/ld-musl-x86_64.so.1</div>
<p>Alpine dùng <strong>musl</strong>, một thư viện C nhỏ gọn viết mới hoàn toàn. Debian, Ubuntu, RHEL và mọi biến thể distroless đều dùng <strong>glibc</strong>. Cả hai đều hiện thực cùng một chuẩn; chúng KHÔNG tương thích ở mức nhị phân. Một thư viện chia sẻ đã biên dịch theo glibc sẽ không nạp được trên musl, và thông báo lỗi thường chẳng giúp được gì.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Mô-đun native dựng sẵn</span><span class="v">Các gói npm đem theo chương trình dựng sẵn cho <code>linux-x64-glibc</code>. Trên Alpine, hoặc là có sẵn một bản musl và nó được tải về, hoặc npm lùi về biên dịch từ mã nguồn — thứ cần <code>python3 make g++</code> trong ảnh và mất vài phút.</span></div>
  <div class="kv"><span class="k">Wheel của Python</span><span class="v">Wheel trên PyPI là <code>manylinux</code>, tức là glibc. Trên Alpine, <code>pip install</code> biên dịch <em>MỌI THỨ</em> từ mã nguồn: numpy, pandas, cryptography, psycopg2. Một lượt cài 20 giây thành 10 phút, và đôi khi hỏng hẳn. Đó là lý do Bài 4.5 nói <code>python:3.12-slim</code>, chứ không phải alpine.</span></div>
  <div class="kv"><span class="k">Engine của Prisma</span><span class="v">Prisma tải về một chương trình query engine khớp với nền tảng. Alpine cần <code>binaryTargets = ["linux-musl-openssl-3.0.x"]</code> trong <code>schema.prisma</code>; sai chỗ đó thì container khởi động, không nối được vào đâu, rồi khởi động lại mãi mãi.</span></div>
  <div class="kv"><span class="k">DNS hành xử khác</span><span class="v">Trình phân giải của musl hỏi mọi máy chủ tên SONG SONG và trong lịch sử có những chỗ hổng ở việc xử lý miền <code>search</code> với dự phòng TCP. Triệu chứng: những cú hỏng DNS chập chờn bên trong Kubernetes rồi biến mất khi đổi sang nền Debian.</span></div>
  <div class="kv"><span class="k">Hiệu năng</span><span class="v">malloc của musl đơn giản hơn và chậm hơn dưới áp lực cấp phát đa luồng nặng. Với phần lớn ứng dụng web thì không đo nổi; với những tải nặng về cấp phát thì đã có phép đo cho ra mức chênh hai chữ số phần trăm.</span></div>
</div>
<div class="callout warn"><strong>Cú sự cố của chính dự án này chính xác là chuyện đó.</strong> Một script deploy đã dựng bằng <code>Dockerfile</code> mặc định thay vì <code>Dockerfile.backend</code>, và điều đó đặt một engine Prisma <code>debian-openssl-3.0.x</code> — glibc — lên một cái nền <code>node:22-alpine</code>. Lượt dựng xanh, lượt đẩy xanh, lượt tráo xanh, rồi backend khởi động lại vô tận và API trả 502 trong bảy phút. Bài học ghi lại sau đó là: <em>một lượt dựng xanh KHÔNG có nghĩa là một cái ảnh chạy được</em>. Giờ có một chốt kiểm libc ↔ engine chạy TRƯỚC lúc đẩy.</div>
<pre><code><span class="tok-comment"># Phát hiện chỗ lệch TRƯỚC KHI nó tới production</span>
docker run --rm --entrypoint sh app:latest -c '
  echo -n "libc: "; ( ldd --version 2&gt;&amp;1 | head -1 ) || true
  echo -n "prisma engines: "; ls node_modules/.prisma/client/ 2&gt;/dev/null | grep -o "engine.*" | head -2
'</code></pre>
<div class="out">libc: musl libc (x86_64)
prisma engines: libquery_engine-linux-musl-openssl-3.0.x.so.node</div>

<h3>Khi nào từng cái nền là đúng</h3>
<div class="lz-map">
  <div class="lz-stage">Dùng -slim (Debian)</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Mặc định cho một ảnh cuối</span><span class="lz-nsub">Mọi thứ có mô-đun native, Python, Prisma, hoặc một cây thư viện bạn chưa quen. Tốn khoảng 40MB hơn Alpine và loại bỏ trọn một lớp vấn đề. Nếu bạn không chắc thì đây là câu trả lời.</span></div></div>
  <div class="lz-stage">Dùng -alpine</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Thư viện thuần JS, hoặc bạn đã KIỂM CHỨNG</span><span class="lz-nsub">Một API Node không có mô-đun biên dịch, một ảnh nginx, một công cụ Go nhỏ muốn có shell. Hãy kiểm bằng một lượt CHẠY THẬT, không phải bằng một lượt dựng xanh.</span></div></div>
  <div class="lz-stage">Dùng distroless</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Production, khi ứng dụng đã ổn định</span><span class="lz-nsub">glibc, nên không có bất ngờ musl nào; không shell, nên bề mặt tấn công nhỏ hơn nhiều; và một người anh em <code>:debug</code> từ cùng một Dockerfile cho lúc bạn cần nhìn (Bài 6.1).</span></div></div>
  <div class="lz-stage">Dùng scratch</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một chương trình tĩnh duy nhất, không gì khác</span><span class="lz-nsub">Go hoặc Rust. Nhớ rằng chứng chỉ CA và dữ liệu múi giờ đều VẮNG MẶT — hãy chép chúng từ một ảnh thật vào nếu chương trình cần.</span></div></div>
  <div class="lz-stage">Dùng ảnh đầy đủ</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">CHỈ làm stage dựng</span><span class="lz-nsub">Trình biên dịch đã có sẵn, không phải cài gì, và kích thước của nó không bao giờ tới được ảnh cuối (Bài 6.1).</span></div></div>
</div>

<h3>Đọc cái giá thật của một ảnh nền</h3>
<pre><code>docker scout quickview node:22-slim 2&gt;/dev/null | head -8
docker scout quickview node:22-alpine 2&gt;/dev/null | head -6</code></pre>
<div class="out">  Target             │  node:22-slim         │    0C     2H     8M    41L
    digest           │  a1b2c3d4e5f6         │
  Base image         │  debian:bookworm-slim │    0C     0H     2M    31L

  Target             │  node:22-alpine       │    0C     0H     1M     6L
    digest           │  9f8e7d6c5b4a         │
  Base image         │  alpine:3.20          │    0C     0H     0M     3L</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Alpine thật sự có ít CVE hơn</span><span class="v">Vì nó có ít gói hơn hẳn. Đó là một lợi thế CÓ THẬT và là lý do những người coi trọng an ninh với tay tới nó — nhưng hãy đếm những cái THẬT SỰ áp cho tiến trình của bạn, đừng đếm con số thô.</span></div>
  <div class="kv"><span class="k">Phần lớn phát hiện mức thấp là không với tới được</span><span class="v">Một CVE trong <code>libtiff</code> nằm trong một cái ảnh chẳng bao giờ giải mã ảnh thì không phải rủi ro bạn đang có. Bài 6.5 nói về việc PHÂN LOẠI thay vì đếm.</span></div>
  <div class="kv"><span class="k">Distroless mới là kẻ thắng thật ở đây</span><span class="v">Ít gói hơn Alpine <em>VÀ</em> dùng glibc. Nếu thứ bạn đang tối ưu là số CVE thì distroless thắng cả hai.</span></div>
  <div class="kv"><span class="k">Con số đó thay đổi mà không cần bạn</span><span class="v">Số CVE của một ảnh nền tăng lên khi có CVE mới được công bố cho những gói nó vốn đã có. Nhịp DỰNG LẠI quan trọng hơn con số vào cái ngày bạn chọn (Bài 3.2).</span></div>
</div>

<h3>Ghim cái nền</h3>
<pre><code><span class="tok-comment"># Tốt: bản phụ + biến thể, bản vá vẫn tới</span>
FROM node:22-alpine

<span class="tok-comment"># Tốt hơn: ghim luôn bản phát hành Alpine hay Debian, để nâng OS nền là có chủ ý</span>
FROM node:22-alpine3.20
FROM python:3.12-bookworm

<span class="tok-comment"># Tốt nhất cho production: tag đọc được VÀ digest bất biến (Bài 3.2)</span>
FROM node:22-alpine3.20@sha256:b8f2c1a4e9d3f7a6b5c4d3e2f1908877665544332211aabbccddeeff0011223344</code></pre>
<div class="callout ok"><strong>Hãy ghim BẢN PHÁT HÀNH CỦA HỆ ĐIỀU HÀNH, không chỉ phiên bản ngôn ngữ.</strong> <code>node:22-alpine</code> đã âm thầm dịch từ Alpine 3.19 sang 3.20 rồi 3.21 trong vòng một năm, và mỗi lần dịch là đổi phiên bản thư viện hệ thống ngay dưới chân bạn. <code>node:22-alpine3.20</code> giữ chuyện đó ổn định cho tới khi bạn chọn khác — và điều đó biến "bản dựng của chúng tôi hỏng mà chẳng có gì thay đổi" thành một quyết định bạn đưa ra một cách có chủ ý.</div>

<a class="link-card" href="https://hub.docker.com/_/node" target="_blank" rel="noopener">
  <span class="lc-ico">🟩</span>
  <span class="lc-body"><span class="lc-title">Tài liệu ảnh node chính thức</span><span class="lc-sub">Giải thích danh sách tag — <code>-slim</code>, <code>-alpine</code> và những tag trần chứa gì — cộng ghi chú của chính người bảo trì về những lúc Alpine là một ý tồi.</span></span>
</a>
<a class="link-card" href="https://wiki.musl-libc.org/functional-differences-from-glibc.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">musl — khác biệt chức năng so với glibc</span><span class="lc-sub">Danh sách của chính người bảo trì, gồm hành vi của trình phân giải DNS và kích thước ngăn xếp mặc định làm hỏng vài chương trình đa luồng. Nguồn gốc khi Alpine hành xử lạ.</span></span>
</a>
<a class="link-card" href="https://github.com/GoogleContainerTools/distroless" target="_blank" rel="noopener">
  <span class="lc-ico">🪶</span>
  <span class="lc-body"><span class="lc-title">distroless</span><span class="lc-sub">Biến thể nào chứa gì, các tag <code>:nonroot</code> với <code>:debug</code>, và ví dụ đầy đủ theo từng ngôn ngữ. Hãy đọc trước cái ảnh distroless đầu tiên của bạn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: chọn cái nền</span><span class="lc-sub">Bài chấm điểm: chọn ảnh nền cho bốn ứng dụng khác nhau và biện luận, chẩn đoán một mô-đun native chỉ hỏng trên Alpine, phát hiện lệch libc/engine trước khi deploy, và ghim một ảnh nền theo ba cách.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> chuyển sang Alpine "cho ảnh nhỏ đi" rồi đem đi vì lượt dựng đã qua. Bước cài THÀNH CÔNG — npm tìm thấy một bản dựng sẵn cho musl, hoặc âm thầm biên dịch từ mã nguồn — và cú hỏng hiện ra lúc CHẠY, trên máy chủ, dưới dạng một mô-đun không nạp được hoặc một engine không khởi động nổi. Tệ hơn, vài thư viện không hỏng hẳn mà chỉ SUY GIẢM: một trình phân giải DNS hơi khác tạo ra những cú tra cứu hỏng chập chờn dưới tải mà chẳng bao giờ tái hiện được ở máy. Cái luật: đổi ảnh nền là một thay đổi cần một lượt CHẠY THẬT, không phải một lượt dựng xanh. Hãy khởi động container, gọi một endpoint thật, và đọc log — còn nếu ứng dụng dùng Prisma, mô-đun native hay wheel Python thì hãy dành sẵn một buổi chiều, hoặc đơn giản là dùng <code>-slim</code>.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Alpine dùng musl còn mọi thứ khác dùng glibc; chúng KHÔNG tương thích nhị phân, và đó là lý do mô-đun native, wheel Python và engine Prisma vỡ đúng ở đó. <code>-slim</code> là mặc định an toàn cho một ảnh cuối — hơn Alpine chừng 40MB và không có bất ngờ nào — còn distroless là câu trả lời production tốt hơn khi ứng dụng đã ổn định. Và hãy ghim bản phát hành hệ điều hành ngay trong tag, không chỉ phiên bản ngôn ngữ, để việc nâng OS nền là một QUYẾT ĐỊNH chứ không phải một sự cố.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — Finding and removing the megabytes|||6.3 — Tìm ra và cắt đi những megabyte',
      slug: 'dk-6-3-cat-kich-thuoc',
      type: 'LESSON',
      description: 'Đo xem byte nằm ở đâu bằng docker history và dive, tám việc thật sự có tác dụng theo thứ tự hiệu quả, những gì riêng Node và Python, và ba thứ KHÔNG đáng bận tâm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Finding and removing the megabytes</h2>
<p class="lead">Image size is worth caring about for concrete reasons: pull time on every deploy, storage on every host and in the registry, and attack surface. But it is easy to spend an afternoon shaving 8MB while a 400MB directory sits in plain sight. Measure first, then work down the list in order of effect.</p>

<h3>Where the bytes are</h3>
<pre><code>docker history app:1.0 --format 'table {{.Size}}\\t{{.CreatedBy}}' --no-trunc \\
  | head -8 | cut -c1-110</code></pre>
<div class="out">SIZE      CREATED BY
0B        CMD ["node" "dist/index.js"]
412MB     COPY /app/node_modules ./node_modules # buildkit
2.11MB    COPY /app/dist ./dist # buildkit
0B        ENV NODE_ENV=production
188MB     RUN /bin/sh -c apk add --no-cache python3 make g++ # buildkit
185MB     /bin/sh -c #(nop) ADD file:… in /</div>
<pre><code><span class="tok-comment"># dive gives the same answer with a file tree — install it once, use it forever</span>
docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock \\
  wagoodman/dive:latest app:1.0 --ci 2&gt;&amp;1 | tail -8</code></pre>
<div class="out">Analyzing image
  efficiency: 71.4 %
  wastedBytes: 214088142 bytes (214 MB)
  userWastedPercent: 28.6 %
Inefficient Files:
Count  Wasted Space  File Path
    2        188 MB  /usr/lib/python3.12
    2         14 MB  /var/cache/apk
    3        9.1 MB  /root/.npm</div>
<p>Two findings in ten seconds: <code>node_modules</code> is 412MB, and a Python toolchain that was installed and then removed is still occupying 188MB in a lower layer. Neither would have been obvious from reading the Dockerfile.</p>

<h3>Eight things that work, in order of effect</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Multi-stage</span><span class="lz-t">typically 60–85% off</span><span class="lz-d">Compilers, dev dependencies and source simply never reach the final image (Lesson 6.1). Nothing else comes close, and everything below is a rounding error until you have done this.</span></div>
  <div class="lz-step"><span class="lz-k">2 · The right base</span><span class="lz-t">1.13GB → 224MB → 152MB</span><span class="lz-d">Full → slim → distroless. Free, and one line (Lesson 6.2). Do not trade correctness for it.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Prune production dependencies</span><span class="lz-t">often 50–70% of node_modules</span><span class="lz-d"><code>npm ci --omit=dev</code> in a dedicated stage, or <code>npm prune --omit=dev</code> at the end of the build. The single biggest remaining item in most Node images.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Clean caches inside the same RUN</span><span class="lz-t">10–200MB depending on package manager</span><span class="lz-d"><code>rm -rf /var/lib/apt/lists/*</code>, <code>--no-cache</code> for apk, <code>--no-cache-dir</code> for pip. Must be the same <code>RUN</code>, or the bytes stay in the earlier layer (Lesson 1.2).</span></div>
  <div class="lz-step"><span class="lz-k">5 · .dockerignore</span><span class="lz-t">whatever COPY . . was dragging in</span><span class="lz-d">Prevents <code>node_modules</code>, <code>.git</code> and build output from being copied at all. Also fixes build speed (Lesson 4.1).</span></div>
  <div class="lz-step"><span class="lz-k">6 · --no-install-recommends</span><span class="lz-t">30–150MB on Debian</span><span class="lz-d">apt pulls in a surprising amount of suggested software by default. One flag, no downside.</span></div>
  <div class="lz-step"><span class="lz-k">7 · COPY --chown instead of RUN chown -R</span><span class="lz-t">up to the size of what you copied</span><span class="lz-d">A recursive chown rewrites every file into a new layer, doubling that part of the image (Lesson 4.2).</span></div>
  <div class="lz-step"><span class="lz-k">8 · Framework-specific output modes</span><span class="lz-t">Next.js standalone: ~1GB off</span><span class="lz-d">Next's <code>output: 'standalone'</code>, Vite's build output, Go's <code>-ldflags="-s -w"</code>. Check whether your framework has one — it is usually a single config line (Lesson 4.5).</span></div>
</div>

<h3>Node specifics</h3>
<pre><code><span class="tok-comment"># What is actually in node_modules?</span>
docker run --rm app:1.0 sh -c 'du -sh node_modules; du -sh node_modules/* | sort -hr | head -5'</code></pre>
<div class="out">412M	node_modules
118M	node_modules/@swc
64M	node_modules/typescript
41M	node_modules/@esbuild
22M	node_modules/prisma
19M	node_modules/@prisma</div>
<p><code>@swc</code>, <code>typescript</code> and <code>@esbuild</code> are build tools — 223MB of compiler that the running server never loads. They are in the image because the build stage's <code>node_modules</code> was copied wholesale (Lesson 6.1's pitfall). Note <code>prisma</code> versus <code>@prisma</code>: the CLI is a dev dependency and the client is not, so pruning removes 22MB and keeps the 19MB you need.</p>
<pre><code><span class="tok-comment"># The fix, as a separate stage</span>
FROM node:22-alpine AS proddeps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

FROM node:22-alpine
COPY --from=proddeps /app/node_modules ./node_modules
COPY --from=build    /app/dist ./dist</code></pre>
<div class="out">app:1.0  612MB
app:1.1  196MB</div>

<h3>Python specifics</h3>
<pre><code>FROM python:3.12-slim AS build
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends build-essential libpq-dev \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*
COPY requirements.txt ./
RUN --mount=type=cache,target=/root/.cache/pip \\
    pip install --prefix=/install --no-compile -r requirements.txt

FROM python:3.12-slim
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends libpq5 \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*
COPY --from=build /install /usr/local
COPY . .</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">--prefix=/install</span><span class="v">Installs into a directory you can copy as one unit, rather than scattering files across the image. The standard Python multi-stage pattern.</span></div>
  <div class="kv"><span class="k">build-essential in the build stage only</span><span class="v">150MB of compilers that only mattered while wheels were being built. The final stage installs the <em>runtime</em> library (<code>libpq5</code>), not the development one (<code>libpq-dev</code>).</span></div>
  <div class="kv"><span class="k">--no-compile</span><span class="v">Skips writing <code>.pyc</code> files, which are regenerated at run time anyway. Saves 10–20% of the site-packages tree, at the cost of a slower first import.</span></div>
  <div class="kv"><span class="k">PYTHONDONTWRITEBYTECODE=1</span><span class="v">Stops the running container writing <code>.pyc</code> into its writable layer. Small, and it keeps <code>docker diff</code> readable (Lesson 2.2).</span></div>
</div>

<h3>Three things not to bother with</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Squashing layers</span><span class="v"><code>--squash</code> is experimental, and it destroys layer sharing: two squashed images from the same base share nothing, so five services that used to share a 185MB base now cost 925MB on the host. Multi-stage achieves the real goal without this cost.</span></div>
  <div class="kv"><span class="k">Minimising the layer count</span><span class="v">Layers are nearly free. Chaining fifteen commands into one unreadable <code>RUN</code> to save a few kilobytes of metadata costs you cache granularity (Lesson 5.2) and readability. Group by change frequency instead.</span></div>
  <div class="kv"><span class="k">Alpine when it costs correctness</span><span class="v">40MB is not worth an afternoon of musl debugging, a source-compiled numpy, or an intermittent DNS failure in production (Lesson 6.2). Take the 40MB.</span></div>
  <div class="kv"><span class="k">And one thing that IS worth it</span><span class="v">Checking the number in CI. <code>docker image inspect app --format '{{.Size}}'</code> with a threshold catches the day someone adds a 300MB dependency, which is when it is cheap to fix.</span></div>
</div>
<pre><code><span class="tok-comment"># A size gate for CI</span>
MAX=\$((250 * 1024 * 1024))
SIZE=\$(docker image inspect app:ci --format '{{.Size}}')
echo "image size: \$((SIZE / 1024 / 1024))MB"
[ "\$SIZE" -gt "\$MAX" ] &amp;&amp; { echo "image exceeds \$((MAX/1024/1024))MB" &gt;&amp;2; exit 1; }
echo "size ok"</code></pre>
<div class="out">image size: 196MB
size ok</div>

<h3>A worked before and after</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Start: 1.24GB</span><span class="lz-lnote">Single stage, <code>node:22</code>, <code>COPY . .</code>, all dependencies, npm cache, source, build tools.</span></div>
  <div class="lz-layer"><span class="lz-lname">Multi-stage: 612MB</span><span class="lz-lnote">Compilers and source gone. Still carrying the build stage's full <code>node_modules</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Separate proddeps stage: 196MB</span><span class="lz-lnote">Only production dependencies. The single biggest remaining win, and three lines of Dockerfile.</span></div>
  <div class="lz-layer"><span class="lz-lname">Distroless base: 152MB</span><span class="lz-lnote">No shell, no package manager, no <code>apk</code>. Plus a <code>:debug</code> sibling for when you need to look (Lesson 6.1).</span></div>
  <div class="lz-layer"><span class="lz-lname">Where it stops</span><span class="lz-lnote">The remaining 152MB is the Node runtime and your dependencies. Going further means changing the application, not the Dockerfile — which is a different conversation and usually not worth having.</span></div>
</div>

<a class="link-card" href="https://github.com/wagoodman/dive" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">dive</span><span class="lc-sub">Layer-by-layer file browser with an efficiency score and a "wasted bytes" figure. <code>--ci</code> mode makes it usable as a build gate. The single most useful tool in this lesson.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/best-practices/#minimize-the-number-of-layers" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">Best practices — image size</span><span class="lc-sub">Docker's own guidance, including the nuanced position on layer count that this lesson agrees with: group by purpose, not by count.</span></span>
</a>
<a class="link-card" href="https://github.com/slimtoolkit/slim" target="_blank" rel="noopener">
  <span class="lc-ico">✂️</span>
  <span class="lc-body"><span class="lc-title">slim (formerly docker-slim)</span><span class="lc-sub">Runs your container, observes which files are actually touched, and rebuilds a minimal image. Impressive results and a real risk of removing something only used on a rare code path — treat its output as something to test hard, not to trust.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: cut it down</span><span class="lc-sub">Graded exercises: find the 188MB nobody expected with <code>dive</code>, take a 1.2GB image under 250MB, add a size gate to CI, and explain why <code>--squash</code> would make the host use more disk, not less.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> deleting files in a later <code>RUN</code> and expecting the image to shrink. <code>RUN apk add python3 make g++</code> followed by <code>RUN apk del python3 make g++</code> leaves the full 188MB in the earlier layer, adds a whiteout layer on top, and makes the image very slightly <em>larger</em> (Lesson 1.2). The same applies to <code>RUN rm -rf /var/lib/apt/lists/*</code> as its own instruction, and to deleting a secret you copied in. Two correct answers: do the install and the cleanup in the <strong>same</strong> <code>RUN</code>, so they net out within one layer; or use a build stage and never copy the tools forward at all — which is better, because it also keeps the cache granularity you would otherwise lose.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Measure before you optimise: <code>docker history</code> and <code>dive</code> find the 400MB directory in ten seconds, and it is usually not where you expected. Multi-stage and pruning production dependencies account for most of the achievable saving; everything after those two is a rounding error. And deleting in a later layer never shrinks anything — clean up inside the same <code>RUN</code>, or never bring the thing into the final stage.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Tìm ra và cắt đi những megabyte</h2>
<p class="lead">Kích thước ảnh đáng quan tâm vì những lý do cụ thể: thời gian kéo ở mọi lần deploy, dung lượng lưu trên mọi máy chủ và trong registry, và bề mặt tấn công. Nhưng rất dễ ném cả một buổi chiều để gọt đi 8MB trong khi một thư mục 400MB nằm chình ình ngay đó. Hãy ĐO trước, rồi đi từ trên xuống theo thứ tự hiệu quả.</p>

<h3>Byte nằm ở đâu</h3>
<pre><code>docker history app:1.0 --format 'table {{.Size}}\\t{{.CreatedBy}}' --no-trunc \\
  | head -8 | cut -c1-110</code></pre>
<div class="out">SIZE      CREATED BY
0B        CMD ["node" "dist/index.js"]
412MB     COPY /app/node_modules ./node_modules # buildkit
2.11MB    COPY /app/dist ./dist # buildkit
0B        ENV NODE_ENV=production
188MB     RUN /bin/sh -c apk add --no-cache python3 make g++ # buildkit
185MB     /bin/sh -c #(nop) ADD file:… in /</div>
<pre><code><span class="tok-comment"># dive cho cùng câu trả lời kèm một cây file — cài một lần, dùng mãi</span>
docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock \\
  wagoodman/dive:latest app:1.0 --ci 2&gt;&amp;1 | tail -8</code></pre>
<div class="out">Analyzing image
  efficiency: 71.4 %
  wastedBytes: 214088142 bytes (214 MB)
  userWastedPercent: 28.6 %
Inefficient Files:
Count  Wasted Space  File Path
    2        188 MB  /usr/lib/python3.12
    2         14 MB  /var/cache/apk
    3        9.1 MB  /root/.npm</div>
<p>Hai phát hiện trong mười giây: <code>node_modules</code> nặng 412MB, và một bộ công cụ Python đã được cài rồi gỡ vẫn đang chiếm 188MB ở một tầng bên dưới. Không phát hiện nào hiển nhiên nếu chỉ đọc Dockerfile.</p>

<h3>Tám việc có tác dụng, xếp theo hiệu quả</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Dựng nhiều tầng</span><span class="lz-t">thường cắt 60–85%</span><span class="lz-d">Trình biên dịch, thư viện dev và mã nguồn đơn giản là KHÔNG BAO GIỜ tới được ảnh cuối (Bài 6.1). Không gì sánh được, và mọi thứ bên dưới chỉ là con số làm tròn cho tới khi bạn làm xong cái này.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Đúng ảnh nền</span><span class="lz-t">1,13GB → 224MB → 152MB</span><span class="lz-d">Đầy đủ → slim → distroless. Miễn phí, và tốn một dòng (Bài 6.2). Nhưng đừng đánh đổi tính đúng đắn lấy nó.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Tỉa thư viện production</span><span class="lz-t">thường là 50–70% của node_modules</span><span class="lz-d"><code>npm ci --omit=dev</code> trong một stage riêng, hoặc <code>npm prune --omit=dev</code> ở cuối stage dựng. Là món lớn nhất còn sót lại trong hầu hết ảnh Node.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Dọn bộ đệm NGAY TRONG cùng lệnh RUN</span><span class="lz-t">10–200MB tuỳ trình quản lý gói</span><span class="lz-d"><code>rm -rf /var/lib/apt/lists/*</code>, <code>--no-cache</code> cho apk, <code>--no-cache-dir</code> cho pip. PHẢI là cùng một <code>RUN</code>, không thì mấy byte đó nằm lại ở tầng trước (Bài 1.2).</span></div>
  <div class="lz-step"><span class="lz-k">5 · .dockerignore</span><span class="lz-t">bằng đúng cái mà COPY . . đang lôi vào</span><span class="lz-d">Ngăn <code>node_modules</code>, <code>.git</code> và kết quả build khỏi bị chép vào ngay từ đầu. Đồng thời chữa luôn tốc độ dựng (Bài 4.1).</span></div>
  <div class="lz-step"><span class="lz-k">6 · --no-install-recommends</span><span class="lz-t">30–150MB trên Debian</span><span class="lz-d">apt mặc định kéo về một lượng phần mềm gợi ý đáng ngạc nhiên. Một cái cờ, không có nhược điểm nào.</span></div>
  <div class="lz-step"><span class="lz-k">7 · COPY --chown thay cho RUN chown -R</span><span class="lz-t">tốn tới bằng kích thước thứ bạn vừa chép</span><span class="lz-d">Một lệnh chown đệ quy ghi lại MỌI file vào một tầng mới, làm phình gấp đôi phần đó của ảnh (Bài 4.2).</span></div>
  <div class="lz-step"><span class="lz-k">8 · Chế độ output riêng của framework</span><span class="lz-t">Next.js standalone: cắt ~1GB</span><span class="lz-d"><code>output: 'standalone'</code> của Next, output build của Vite, <code>-ldflags="-s -w"</code> của Go. Hãy kiểm xem framework của bạn có cái nào không — thường chỉ là một dòng cấu hình (Bài 4.5).</span></div>
</div>

<h3>Những gì riêng Node</h3>
<pre><code><span class="tok-comment"># Trong node_modules thật ra có gì?</span>
docker run --rm app:1.0 sh -c 'du -sh node_modules; du -sh node_modules/* | sort -hr | head -5'</code></pre>
<div class="out">412M	node_modules
118M	node_modules/@swc
64M	node_modules/typescript
41M	node_modules/@esbuild
22M	node_modules/prisma
19M	node_modules/@prisma</div>
<p><code>@swc</code>, <code>typescript</code> và <code>@esbuild</code> là CÔNG CỤ DỰNG — 223MB trình biên dịch mà máy chủ đang chạy chẳng bao giờ nạp. Chúng nằm trong ảnh vì <code>node_modules</code> của stage dựng đã bị chép nguyên khối (cái bẫy của Bài 6.1). Chú ý <code>prisma</code> so với <code>@prisma</code>: cái CLI là thư viện dev còn cái client thì không, nên tỉa đi là bớt 22MB và giữ lại 19MB bạn cần.</p>
<pre><code><span class="tok-comment"># Cách chữa, dưới dạng một stage riêng</span>
FROM node:22-alpine AS proddeps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

FROM node:22-alpine
COPY --from=proddeps /app/node_modules ./node_modules
COPY --from=build    /app/dist ./dist</code></pre>
<div class="out">app:1.0  612MB
app:1.1  196MB</div>

<h3>Những gì riêng Python</h3>
<pre><code>FROM python:3.12-slim AS build
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends build-essential libpq-dev \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*
COPY requirements.txt ./
RUN --mount=type=cache,target=/root/.cache/pip \\
    pip install --prefix=/install --no-compile -r requirements.txt

FROM python:3.12-slim
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends libpq5 \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*
COPY --from=build /install /usr/local
COPY . .</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">--prefix=/install</span><span class="v">Cài vào một thư mục mà bạn chép được như MỘT khối, thay vì rải file khắp cái ảnh. Mẫu dựng nhiều tầng tiêu chuẩn của Python.</span></div>
  <div class="kv"><span class="k">build-essential CHỈ ở stage dựng</span><span class="v">150MB trình biên dịch chỉ có ý nghĩa trong lúc dựng wheel. Stage cuối cài thư viện <em>LÚC CHẠY</em> (<code>libpq5</code>), không phải bản dành cho phát triển (<code>libpq-dev</code>).</span></div>
  <div class="kv"><span class="k">--no-compile</span><span class="v">Bỏ qua việc ghi file <code>.pyc</code>, thứ dù sao cũng được sinh lại lúc chạy. Tiết kiệm 10–20% cây site-packages, đổi lại lần import đầu tiên chậm hơn.</span></div>
  <div class="kv"><span class="k">PYTHONDONTWRITEBYTECODE=1</span><span class="v">Chặn container đang chạy ghi <code>.pyc</code> vào tầng ghi được của nó. Nhỏ thôi, và nó giữ cho <code>docker diff</code> còn đọc được (Bài 2.2).</span></div>
</div>

<h3>Ba thứ KHÔNG đáng bận tâm</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ép phẳng các tầng</span><span class="v"><code>--squash</code> là thử nghiệm, và nó PHÁ việc dùng chung tầng: hai ảnh đã ép phẳng từ cùng một nền không chia sẻ gì cả, nên năm dịch vụ vốn dùng chung một nền 185MB giờ ngốn 925MB trên máy chủ. Dựng nhiều tầng đạt được mục tiêu thật mà không phải trả cái giá này.</span></div>
  <div class="kv"><span class="k">Giảm tối đa số tầng</span><span class="v">Tầng gần như miễn phí. Xâu mười lăm câu lệnh vào một <code>RUN</code> không đọc nổi để tiết kiệm vài kilobyte siêu dữ liệu là bạn mất độ mịn của cache (Bài 5.2) và mất luôn khả năng đọc. Hãy gộp theo TẦN SUẤT THAY ĐỔI thay vào đó.</span></div>
  <div class="kv"><span class="k">Alpine khi nó đánh đổi tính đúng đắn</span><span class="v">40MB không đáng một buổi chiều gỡ lỗi musl, một cái numpy biên dịch từ mã nguồn, hay một cú hỏng DNS chập chờn trên production (Bài 6.2). Cứ lấy 40MB đó đi.</span></div>
  <div class="kv"><span class="k">Và MỘT thứ thì ĐÁNG</span><span class="v">Kiểm con số đó trong CI. <code>docker image inspect app --format '{{.Size}}'</code> kèm một ngưỡng sẽ bắt được cái ngày có người thêm một thư viện 300MB, và đó là lúc sửa còn rẻ.</span></div>
</div>
<pre><code><span class="tok-comment"># Một cổng chặn kích thước cho CI</span>
MAX=\$((250 * 1024 * 1024))
SIZE=\$(docker image inspect app:ci --format '{{.Size}}')
echo "kích thước ảnh: \$((SIZE / 1024 / 1024))MB"
[ "\$SIZE" -gt "\$MAX" ] &amp;&amp; { echo "ảnh vượt \$((MAX/1024/1024))MB" &gt;&amp;2; exit 1; }
echo "kích thước ổn"</code></pre>
<div class="out">kích thước ảnh: 196MB
kích thước ổn</div>

<h3>Một ví dụ trước và sau</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Bắt đầu: 1,24GB</span><span class="lz-lnote">Một tầng, <code>node:22</code>, <code>COPY . .</code>, mọi thư viện, bộ đệm npm, mã nguồn, công cụ dựng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nhiều tầng: 612MB</span><span class="lz-lnote">Trình biên dịch và mã nguồn biến mất. Vẫn còn mang theo trọn <code>node_modules</code> của stage dựng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Stage proddeps riêng: 196MB</span><span class="lz-lnote">Chỉ còn thư viện production. Thắng lợi lớn nhất còn lại, và tốn ba dòng Dockerfile.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nền distroless: 152MB</span><span class="lz-lnote">Không shell, không trình quản lý gói, không cả <code>apk</code>. Cộng một người anh em <code>:debug</code> cho lúc bạn cần nhìn (Bài 6.1).</span></div>
  <div class="lz-layer"><span class="lz-lname">Chỗ nó dừng lại</span><span class="lz-lnote">152MB còn lại là môi trường chạy Node và thư viện của bạn. Đi xa hơn nghĩa là đổi ỨNG DỤNG chứ không phải Dockerfile — và đó là một cuộc trò chuyện khác, thường là không đáng có.</span></div>
</div>

<a class="link-card" href="https://github.com/wagoodman/dive" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">dive</span><span class="lc-sub">Trình duyệt file theo từng tầng kèm điểm hiệu quả và con số "byte lãng phí". Chế độ <code>--ci</code> khiến nó dùng được làm một cổng chặn lúc dựng. Công cụ hữu ích nhất trong bài này.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/best-practices/#minimize-the-number-of-layers" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">Thực hành tốt — kích thước ảnh</span><span class="lc-sub">Hướng dẫn của chính Docker, gồm cả lập trường tinh tế về số tầng mà bài này đồng tình: gộp theo MỤC ĐÍCH, không theo số lượng.</span></span>
</a>
<a class="link-card" href="https://github.com/slimtoolkit/slim" target="_blank" rel="noopener">
  <span class="lc-ico">✂️</span>
  <span class="lc-body"><span class="lc-title">slim (trước là docker-slim)</span><span class="lc-sub">Chạy container của bạn, quan sát xem những file nào thật sự bị đụng tới, rồi dựng lại một cái ảnh tối giản. Kết quả ấn tượng và có rủi ro THẬT là gỡ mất thứ chỉ dùng ở một nhánh mã hiếm gặp — hãy coi output của nó là thứ phải TEST kỹ, không phải thứ để tin.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: cắt nó xuống</span><span class="lc-sub">Bài chấm điểm: tìm ra 188MB không ai ngờ tới bằng <code>dive</code>, đưa một ảnh 1,2GB xuống dưới 250MB, thêm một cổng chặn kích thước vào CI, và giải thích vì sao <code>--squash</code> lại khiến máy chủ tốn NHIỀU đĩa hơn chứ không ít đi.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> xoá file ở một lệnh <code>RUN</code> phía sau rồi mong cái ảnh nhỏ đi. <code>RUN apk add python3 make g++</code> rồi tới <code>RUN apk del python3 make g++</code> để lại trọn 188MB ở tầng trước, thêm một tầng whiteout lên trên, và làm cho ảnh LỚN HƠN một chút (Bài 1.2). Điều tương tự áp cho <code>RUN rm -rf /var/lib/apt/lists/*</code> đứng riêng một chỉ thị, và cho việc xoá một bí mật bạn vừa chép vào. Hai câu trả lời đúng: làm phần cài và phần dọn trong <strong>CÙNG</strong> một <code>RUN</code>, để chúng bù trừ trong một tầng; hoặc dùng một stage dựng và HOÀN TOÀN không chép mấy công cụ đó sang — cái này tốt hơn, vì nó còn giữ được độ mịn của cache mà cách kia làm bạn mất.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Hãy ĐO trước khi tối ưu: <code>docker history</code> và <code>dive</code> tìm ra cái thư mục 400MB trong mười giây, và nó thường không nằm ở chỗ bạn tưởng. Dựng nhiều tầng và tỉa thư viện production chiếm phần lớn khoản tiết kiệm khả dĩ; mọi thứ sau hai cái đó chỉ là con số làm tròn. Và xoá ở một tầng phía sau KHÔNG BAO GIỜ làm nhỏ được thứ gì — hãy dọn ngay trong cùng lệnh <code>RUN</code>, hoặc đừng bao giờ đem cái thứ đó vào stage cuối.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — Running a container safely|||6.4 — Chạy một container cho an toàn',
      slug: 'dk-6-4-chay-an-toan',
      type: 'LESSON',
      description: 'Chạy dưới người dùng không phải root, hệ thống file gốc chỉ đọc, bỏ capability, no-new-privileges, seccomp, và chính xác thì --privileged với việc gắn docker.sock trao đi cái gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Running a container safely</h2>
<p class="lead">By default a container runs as root, can write anywhere in its filesystem, and holds a set of Linux capabilities most applications never use. None of that stops the app working — and each is a step an attacker who gets code execution would otherwise have to earn. Six flags remove them, and none of them cost anything.</p>

<h3>Start with the user</h3>
<pre><code>docker run --rm alpine id
docker run --rm -u 1000:1000 alpine id
docker run --rm node:22-alpine id node</code></pre>
<div class="out">uid=0(root) gid=0(root) groups=0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)
uid=1000 gid=1000 groups=1000
uid=1000(node) gid=1000(node) groups=1000(node)</div>
<pre><code># In the Dockerfile — the durable fix (Lesson 4.2)
FROM node:22-alpine
<span class="tok-comment"># … build steps that need root …</span>
USER node
CMD ["node", "dist/index.js"]

<span class="tok-comment"># Or create one explicitly, with a fixed numeric UID</span>
RUN addgroup -g 10001 app &amp;&amp; adduser -u 10001 -G app -D -H app
USER 10001:10001</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Why it matters despite the container boundary</span><span class="v">There is no user namespace by default (Lesson 1.1), so UID 0 inside is UID 0 outside. A container escape from a root process lands on the host as root; from UID 10001 it lands as a user that owns nothing.</span></div>
  <div class="kv"><span class="k">Use a numeric UID</span><span class="v"><code>USER 10001:10001</code> rather than <code>USER app</code>. Kubernetes' <code>runAsNonRoot</code> check reads the numeric value from the image config and rejects a name it cannot resolve; numeric also survives being run with a different <code>--user</code>.</span></div>
  <div class="kv"><span class="k">Pick a high UID</span><span class="v">Above 10000 avoids colliding with a host user, which matters for bind-mounted files (Lesson 2.4). Official images use 1000, which is also the first human user on most Linux systems.</span></div>
  <div class="kv"><span class="k">Ports below 1024 need a capability</span><span class="v">A non-root process cannot bind port 80. Listen on 8080 and publish it as <code>-p 80:8080</code>, which is better anyway — or add <code>--cap-add=NET_BIND_SERVICE</code> if you truly must.</span></div>
  <div class="kv"><span class="k">Directories must be writable by that UID</span><span class="v"><code>COPY --chown=10001:10001</code> as you copy (Lesson 4.2). A container that starts as root and then drops is a different, worse pattern — use <code>USER</code> and get it right at build time.</span></div>
</div>

<h3>A read-only root filesystem</h3>
<pre><code>docker run --rm --read-only alpine sh -c 'touch /tmp/x' 2&gt;&amp;1 | head -1
docker run --rm --read-only --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  alpine sh -c 'touch /tmp/x &amp;&amp; echo writable'</code></pre>
<div class="out">touch: /tmp/x: Read-only file system
writable</div>
<pre><code><span class="tok-comment"># A real service: read-only, with writable paths declared explicitly</span>
docker run -d --name web \\
  --read-only \\
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  --tmpfs /var/cache/nginx:rw,size=32m \\
  --tmpfs /var/run:rw,size=8m \\
  -p 8080:80 nginx:1.27-alpine
curl -s -o /dev/null -w '%{http_code}\\n' localhost:8080
docker inspect web --format 'readonly={{.HostConfig.ReadonlyRootfs}}'</code></pre>
<div class="out">200
readonly=true</div>
<div class="callout ok"><strong><code>--read-only</code> is the highest-value hardening flag after non-root.</strong> Most attacks need to write something: a web shell, a downloaded binary, a modified config. A read-only root filesystem blocks all of that, and the cost is enumerating the handful of paths your application legitimately writes — which is a useful exercise in itself, because the answer is often "nothing, once logs go to stdout". Find them with <code>docker diff</code> after a normal run (Lesson 2.2).</div>

<h3>Capabilities</h3>
<pre><code>docker run --rm alpine sh -c 'apk add -q libcap; capsh --print | head -2' 2&gt;/dev/null
docker run --rm --cap-drop=ALL alpine sh -c 'apk add -q libcap; capsh --print | head -2' 2&gt;/dev/null</code></pre>
<div class="out">Current: cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,cap_sys_chroot,cap_mknod,cap_audit_write,cap_setfcap=ep
Current: =</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Docker already drops most of them</span><span class="v">Of Linux's ~40 capabilities, a container gets 14. That default is a large part of why containers are safer than running as root on the host.</span></div>
  <div class="kv"><span class="k">--cap-drop=ALL is the right starting point</span><span class="v">Then add back only what fails. Most web applications need none at all — they open a socket above 1024 and read files they own.</span></div>
  <div class="kv"><span class="k">CAP_NET_BIND_SERVICE</span><span class="v">The one you might genuinely need: binding a port below 1024 as a non-root user. Prefer publishing a high port instead.</span></div>
  <div class="kv"><span class="k">CAP_NET_RAW is worth dropping specifically</span><span class="v">It allows raw sockets — ARP spoofing and packet crafting on the container network. It is in the default set and almost nothing needs it. Dropping it costs you <code>ping</code>.</span></div>
  <div class="kv"><span class="k">CAP_SYS_ADMIN is the dangerous one</span><span class="v">Often described as "almost root". Anything asking for it deserves scrutiny — it is the capability most container escapes rely on.</span></div>
</div>

<h3>The whole set, together</h3>
<pre><code>docker run -d --name hardened \\
  --user 10001:10001 \\
  --read-only \\
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  --cap-drop=ALL \\
  --security-opt no-new-privileges:true \\
  --pids-limit 200 \\
  --memory 512m --cpus 1 \\
  -p 127.0.0.1:8080:8080 \\
  app:1.4.2

docker inspect hardened --format \\
  'user={{.Config.User}} ro={{.HostConfig.ReadonlyRootfs}} caps={{.HostConfig.CapDrop}} opts={{.HostConfig.SecurityOpt}}'</code></pre>
<div class="out">user=10001:10001 ro=true caps=[ALL] opts=[no-new-privileges:true]</div>
<pre><code><span class="tok-comment"># The same thing in Compose (Chapter 9)</span>
services:
  api:
    image: app:1.4.2
    user: "10001:10001"
    read_only: true
    tmpfs: [ "/tmp:rw,noexec,nosuid,size=64m" ]
    cap_drop: [ ALL ]
    security_opt: [ "no-new-privileges:true" ]
    pids_limit: 200
    ports: [ "127.0.0.1:8080:8080" ]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">no-new-privileges</span><span class="v">Prevents a process gaining privileges through a setuid binary, which is how many privilege-escalation exploits work. No downside for a normal application; turn it on everywhere.</span></div>
  <div class="kv"><span class="k">seccomp is on by default</span><span class="v">Docker applies a profile blocking about 44 syscalls, including <code>mount</code>, <code>kexec_load</code> and <code>ptrace</code> (until 20.10 relaxed the last one). Never pass <code>--security-opt seccomp=unconfined</code> in production; if a tool needs it, that tool needs scrutiny.</span></div>
  <div class="kv"><span class="k">Limits are security too</span><span class="v"><code>--memory</code>, <code>--cpus</code> and <code>--pids-limit</code> stop one compromised or buggy container from denying service to everything else on the host (Lesson 2.5).</span></div>
  <div class="kv"><span class="k">Bind to loopback</span><span class="v"><code>-p 127.0.0.1:8080:8080</code> so a reverse proxy is the only way in, and Docker's iptables rules cannot accidentally expose it past your firewall (Lesson 2.1).</span></div>
</div>

<h3>The two things that give everything away</h3>
<pre><code><span class="tok-comment"># 1 · --privileged: all capabilities, all devices, no seccomp, no AppArmor</span>
docker run --rm --privileged alpine sh -c 'ls /dev | wc -l; head -c 40 /dev/sda1' 2&gt;&amp;1 | head -2

<span class="tok-comment"># 2 · the Docker socket: control of the daemon is control of the host</span>
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock docker:cli \\
  run --rm -v /:/host alpine chroot /host id</code></pre>
<div class="out">436
uid=0(root) gid=0(root) groups=0(root)</div>
<div class="callout warn"><strong>Both of those are root on the host, with extra steps.</strong> <code>--privileged</code> hands the container every capability and every device — it can read the raw disk, load kernel modules, and reconfigure the network. Mounting <code>docker.sock</code> is arguably worse because it looks harmless: any process that can talk to the daemon can start a new container that mounts <code>/</code> and gives itself a root shell, which is exactly what the second command demonstrates. Both are sometimes necessary — a CI runner that builds images, a monitoring agent — and both should be treated as "this container is root on this machine", with the same care you would give a root shell. For the CI case, a rootless builder or a socket proxy that whitelists API endpoints is a real alternative.</div>

<h3>A checklist you can run</h3>
<pre><code>for c in \$(docker ps --format '{{.Names}}'); do
  docker inspect "\$c" --format '{{.Name}}
    user:      {{if .Config.User}}{{.Config.User}}{{else}}ROOT (!){{end}}
    readonly:  {{.HostConfig.ReadonlyRootfs}}
    privileged:{{.HostConfig.Privileged}}
    capdrop:   {{.HostConfig.CapDrop}}
    secopt:    {{.HostConfig.SecurityOpt}}
    memory:    {{.HostConfig.Memory}}
    sock:      {{range .Mounts}}{{if eq .Source "/var/run/docker.sock"}}MOUNTED (!){{end}}{{end}}'
done</code></pre>
<div class="out">/api
    user:      10001:10001
    readonly:  true
    privileged:false
    capdrop:   [ALL]
    secopt:    [no-new-privileges:true]
    memory:    536870912
    sock:
/legacy-worker
    user:      ROOT (!)
    readonly:  false
    privileged:false
    capdrop:   []
    secopt:    []
    memory:    0
    sock:      MOUNTED (!)</div>

<h3>Reducing what a compromised container can reach</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Drop root first</span><span class="lz-d"><code>USER node</code>. A process that is not root cannot write outside its own files, load kernel modules, or bind a privileged port — most of the escalation paths close here.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Make the root filesystem read-only</span><span class="lz-d"><code>--read-only</code> plus a <code>tmpfs</code> for the paths that genuinely need writes. An attacker who lands cannot leave anything behind.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Drop capabilities to what is used</span><span class="lz-d"><code>--cap-drop ALL</code>, then add back the one or two the process actually needs. Most application containers need none.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Then check what you left open</span><span class="lz-d"><code>--privileged</code>, a mounted Docker socket, or the host network each undo everything above in one flag.</span></div>
</div>
<a class="link-card" href="https://docs.docker.com/engine/security/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">Docker security</span><span class="lc-sub">The default capability set, the seccomp profile, what the daemon attack surface is, and an honest account of what the container boundary does and does not protect.</span></span>
</a>
<a class="link-card" href="https://github.com/docker/docker-bench-security" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">docker-bench-security</span><span class="lc-sub">A script that audits a host and its containers against the CIS Docker Benchmark. Run it once on any server you own; the output is a to-do list.</span></span>
</a>
<a class="link-card" href="https://github.com/Tecnativa/docker-socket-proxy" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">docker-socket-proxy</span><span class="lc-sub">If something genuinely needs the socket — Traefik, a monitoring agent — this fronts it and allows only the endpoints you list. Much better than handing over root.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: harden it</span><span class="lc-sub">Graded exercises: make a container run read-only and find the paths it actually writes, drop all capabilities and add back only what breaks, audit five running containers, and demonstrate why a mounted socket is root.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> adding <code>USER node</code> to an image whose application writes to a directory owned by root. The build succeeds, the image is smaller and safer on paper, and the container dies at start with <code>EACCES: permission denied, open '/app/logs/app.log'</code> — or worse, starts fine and fails hours later on the first write. Two things prevent it: <code>COPY --chown</code> every path the app owns, and run the container once with <code>--read-only</code> before shipping, because anything that needs to write will fail immediately and visibly rather than at 3am. <code>docker diff</code> on a normally-running container lists exactly which paths to declare.</div>
<p class="note-ct"><strong>Three things to remember.</strong> There is no user namespace by default, so root in the container is root on the host — <code>USER</code> with a high numeric UID is the single most valuable line in a Dockerfile after the base image. <code>--read-only</code> plus a <code>--tmpfs</code> for the few paths that need writing blocks most of what an attacker would do next, and costs only the exercise of listing them. And <code>--privileged</code> or a mounted <code>docker.sock</code> is root on the host: sometimes necessary, never casual.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Chạy một container cho an toàn</h2>
<p class="lead">Mặc định thì một container chạy dưới quyền root, ghi được vào bất cứ đâu trong hệ thống file của nó, và giữ một bộ capability của Linux mà phần lớn ứng dụng chẳng bao giờ dùng tới. Không cái nào trong đó ngăn ứng dụng chạy — và mỗi cái đều là một bước mà một kẻ tấn công chiếm được quyền chạy mã lẽ ra phải tự giành lấy. Sáu cái cờ gỡ chúng đi, và không cái nào tốn gì.</p>

<h3>Bắt đầu từ người dùng</h3>
<pre><code>docker run --rm alpine id
docker run --rm -u 1000:1000 alpine id
docker run --rm node:22-alpine id node</code></pre>
<div class="out">uid=0(root) gid=0(root) groups=0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)
uid=1000 gid=1000 groups=1000
uid=1000(node) gid=1000(node) groups=1000(node)</div>
<pre><code># Trong Dockerfile — cách chữa bền vững (Bài 4.2)
FROM node:22-alpine
<span class="tok-comment"># … những bước dựng cần quyền root …</span>
USER node
CMD ["node", "dist/index.js"]

<span class="tok-comment"># Hoặc tự tạo một người dùng, với UID số cố định</span>
RUN addgroup -g 10001 app &amp;&amp; adduser -u 10001 -G app -D -H app
USER 10001:10001</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Vì sao nó quan trọng dù đã có ranh giới container</span><span class="v">Mặc định KHÔNG có user namespace nào (Bài 1.1), nên UID 0 bên trong là UID 0 bên ngoài. Một cú thoát container từ tiến trình root đáp xuống máy chủ với quyền root; từ UID 10001 thì đáp xuống với một người dùng chẳng sở hữu gì.</span></div>
  <div class="kv"><span class="k">Hãy dùng UID dạng SỐ</span><span class="v"><code>USER 10001:10001</code> chứ không phải <code>USER app</code>. Phép kiểm <code>runAsNonRoot</code> của Kubernetes đọc giá trị số từ cấu hình ảnh và TỪ CHỐI một cái tên nó không phân giải được; số cũng sống sót khi ảnh được chạy với một <code>--user</code> khác.</span></div>
  <div class="kv"><span class="k">Chọn một UID CAO</span><span class="v">Trên 10000 thì tránh đụng với một người dùng của máy chủ, điều đó quan trọng với những file được bind mount (Bài 2.4). Ảnh chính thức dùng 1000, và đó cũng là người dùng thật đầu tiên trên hầu hết hệ thống Linux.</span></div>
  <div class="kv"><span class="k">Cổng dưới 1024 cần một capability</span><span class="v">Một tiến trình không phải root thì không bind được cổng 80. Hãy lắng nghe ở 8080 rồi publish thành <code>-p 80:8080</code>, đằng nào cũng tốt hơn — hoặc thêm <code>--cap-add=NET_BIND_SERVICE</code> nếu bạn thật sự bắt buộc.</span></div>
  <div class="kv"><span class="k">Thư mục phải ghi được bởi cái UID đó</span><span class="v"><code>COPY --chown=10001:10001</code> ngay lúc chép (Bài 4.2). Một container khởi động dưới quyền root rồi mới hạ xuống là một mẫu KHÁC và tệ hơn — hãy dùng <code>USER</code> và làm đúng ngay từ lúc dựng.</span></div>
</div>

<h3>Hệ thống file gốc chỉ đọc</h3>
<pre><code>docker run --rm --read-only alpine sh -c 'touch /tmp/x' 2&gt;&amp;1 | head -1
docker run --rm --read-only --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  alpine sh -c 'touch /tmp/x &amp;&amp; echo ghi được'</code></pre>
<div class="out">touch: /tmp/x: Read-only file system
ghi được</div>
<pre><code><span class="tok-comment"># Một dịch vụ thật: chỉ đọc, với những đường dẫn ghi được khai báo TƯỜNG MINH</span>
docker run -d --name web \\
  --read-only \\
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  --tmpfs /var/cache/nginx:rw,size=32m \\
  --tmpfs /var/run:rw,size=8m \\
  -p 8080:80 nginx:1.27-alpine
curl -s -o /dev/null -w '%{http_code}\\n' localhost:8080
docker inspect web --format 'readonly={{.HostConfig.ReadonlyRootfs}}'</code></pre>
<div class="out">200
readonly=true</div>
<div class="callout ok"><strong><code>--read-only</code> là cái cờ gia cố có giá trị cao nhất sau việc không-chạy-root.</strong> Phần lớn cuộc tấn công đều cần GHI một thứ gì đó: một web shell, một chương trình vừa tải về, một cấu hình bị sửa. Một hệ thống file gốc chỉ đọc chặn tất cả những cái đó, và cái giá là phải liệt kê ra một nhúm đường dẫn mà ứng dụng của bạn thật sự ghi vào — bản thân đó đã là một bài tập hữu ích, vì câu trả lời thường là "chẳng cái nào, một khi log đi ra stdout". Hãy tìm chúng bằng <code>docker diff</code> sau một lượt chạy bình thường (Bài 2.2).</div>

<h3>Capability</h3>
<pre><code>docker run --rm alpine sh -c 'apk add -q libcap; capsh --print | head -2' 2&gt;/dev/null
docker run --rm --cap-drop=ALL alpine sh -c 'apk add -q libcap; capsh --print | head -2' 2&gt;/dev/null</code></pre>
<div class="out">Current: cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,cap_sys_chroot,cap_mknod,cap_audit_write,cap_setfcap=ep
Current: =</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Docker vốn đã bỏ đi phần lớn</span><span class="v">Trong khoảng 40 capability của Linux, một container chỉ được 14. Cái mặc định đó là một phần lớn lý do container an toàn hơn việc chạy root ngay trên máy chủ.</span></div>
  <div class="kv"><span class="k">--cap-drop=ALL là điểm khởi đầu ĐÚNG</span><span class="v">Rồi thêm lại đúng thứ nào bị hỏng. Phần lớn ứng dụng web KHÔNG cần cái nào cả — chúng mở một socket trên 1024 và đọc những file chúng sở hữu.</span></div>
  <div class="kv"><span class="k">CAP_NET_BIND_SERVICE</span><span class="v">Cái bạn có thể thật sự cần: bind một cổng dưới 1024 dưới danh nghĩa người dùng không phải root. Hãy ưu tiên publish một cổng cao thay vào đó.</span></div>
  <div class="kv"><span class="k">CAP_NET_RAW đáng bỏ một cách cụ thể</span><span class="v">Nó cho phép socket thô — giả mạo ARP và chế tác gói tin trên mạng container. Nó nằm TRONG bộ mặc định và gần như không gì cần nó. Bỏ nó thì bạn mất lệnh <code>ping</code>.</span></div>
  <div class="kv"><span class="k">CAP_SYS_ADMIN mới là cái nguy hiểm</span><span class="v">Thường được mô tả là "gần như root". Bất cứ thứ gì đòi nó đều đáng bị soi kỹ — nó là capability mà phần lớn cú thoát container dựa vào.</span></div>
</div>

<h3>Trọn bộ, gộp lại</h3>
<pre><code>docker run -d --name hardened \\
  --user 10001:10001 \\
  --read-only \\
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  --cap-drop=ALL \\
  --security-opt no-new-privileges:true \\
  --pids-limit 200 \\
  --memory 512m --cpus 1 \\
  -p 127.0.0.1:8080:8080 \\
  app:1.4.2

docker inspect hardened --format \\
  'user={{.Config.User}} ro={{.HostConfig.ReadonlyRootfs}} caps={{.HostConfig.CapDrop}} opts={{.HostConfig.SecurityOpt}}'</code></pre>
<div class="out">user=10001:10001 ro=true caps=[ALL] opts=[no-new-privileges:true]</div>
<pre><code><span class="tok-comment"># Vẫn thứ đó, viết trong Compose (Chương 9)</span>
services:
  api:
    image: app:1.4.2
    user: "10001:10001"
    read_only: true
    tmpfs: [ "/tmp:rw,noexec,nosuid,size=64m" ]
    cap_drop: [ ALL ]
    security_opt: [ "no-new-privileges:true" ]
    pids_limit: 200
    ports: [ "127.0.0.1:8080:8080" ]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">no-new-privileges</span><span class="v">Ngăn một tiến trình giành thêm đặc quyền qua một chương trình setuid, và đó là cách nhiều cuộc leo thang đặc quyền hoạt động. Không có nhược điểm nào với một ứng dụng bình thường; hãy bật nó ở mọi nơi.</span></div>
  <div class="kv"><span class="k">seccomp mặc định đã BẬT</span><span class="v">Docker áp một hồ sơ chặn khoảng 44 lời gọi hệ thống, gồm <code>mount</code>, <code>kexec_load</code> và <code>ptrace</code> (tới bản 20.10 thì cái cuối được nới ra). Đừng bao giờ truyền <code>--security-opt seccomp=unconfined</code> trên production; nếu một công cụ cần nó thì chính công cụ đó cần bị soi kỹ.</span></div>
  <div class="kv"><span class="k">Giới hạn cũng là an ninh</span><span class="v"><code>--memory</code>, <code>--cpus</code> và <code>--pids-limit</code> ngăn MỘT container bị chiếm hoặc lỗi làm tê liệt mọi thứ khác trên máy chủ (Bài 2.5).</span></div>
  <div class="kv"><span class="k">Gắn vào loopback</span><span class="v"><code>-p 127.0.0.1:8080:8080</code> để một reverse proxy là đường vào DUY NHẤT, và để luật iptables của Docker không vô tình phơi nó ra vượt qua tường lửa của bạn (Bài 2.1).</span></div>
</div>

<h3>Hai thứ trao đi TẤT CẢ</h3>
<pre><code><span class="tok-comment"># 1 · --privileged: mọi capability, mọi thiết bị, không seccomp, không AppArmor</span>
docker run --rm --privileged alpine sh -c 'ls /dev | wc -l; head -c 40 /dev/sda1' 2&gt;&amp;1 | head -2

<span class="tok-comment"># 2 · socket của Docker: điều khiển tiến trình nền là điều khiển cả máy chủ</span>
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock docker:cli \\
  run --rm -v /:/host alpine chroot /host id</code></pre>
<div class="out">436
uid=0(root) gid=0(root) groups=0(root)</div>
<div class="callout warn"><strong>Cả hai đều là quyền ROOT TRÊN MÁY CHỦ, chỉ thêm vài bước.</strong> <code>--privileged</code> trao cho container mọi capability và mọi thiết bị — nó đọc được đĩa thô, nạp được mô-đun nhân, và cấu hình lại được mạng. Gắn <code>docker.sock</code> còn tệ hơn ở chỗ nó TRÔNG vô hại: bất kỳ tiến trình nào nói chuyện được với tiến trình nền cũng khởi chạy được một container mới gắn <code>/</code> vào rồi tự cấp cho mình một shell root, và đó chính xác là điều câu lệnh thứ hai vừa chứng minh. Cả hai đôi khi là CẦN THIẾT — một máy chạy CI dựng ảnh, một agent giám sát — và cả hai nên được đối xử như "container này là root trên cái máy này", với đúng sự cẩn trọng bạn dành cho một shell root. Với trường hợp CI thì một bộ dựng rootless hoặc một proxy socket chỉ cho phép vài endpoint API là một lựa chọn thật.</div>

<h3>Một danh sách kiểm chạy được</h3>
<pre><code>for c in \$(docker ps --format '{{.Names}}'); do
  docker inspect "\$c" --format '{{.Name}}
    user:      {{if .Config.User}}{{.Config.User}}{{else}}ROOT (!){{end}}
    readonly:  {{.HostConfig.ReadonlyRootfs}}
    privileged:{{.HostConfig.Privileged}}
    capdrop:   {{.HostConfig.CapDrop}}
    secopt:    {{.HostConfig.SecurityOpt}}
    memory:    {{.HostConfig.Memory}}
    sock:      {{range .Mounts}}{{if eq .Source "/var/run/docker.sock"}}ĐÃ GẮN (!){{end}}{{end}}'
done</code></pre>
<div class="out">/api
    user:      10001:10001
    readonly:  true
    privileged:false
    capdrop:   [ALL]
    secopt:    [no-new-privileges:true]
    memory:    536870912
    sock:
/legacy-worker
    user:      ROOT (!)
    readonly:  false
    privileged:false
    capdrop:   []
    secopt:    []
    memory:    0
    sock:      ĐÃ GẮN (!)</div>

<h3>Thu hẹp thứ mà một container bị chiếm với tới được</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bỏ quyền root trước tiên</span><span class="lz-d"><code>USER node</code>. Một tiến trình không phải root thì không ghi được ra ngoài phạm vi file của nó, không nạp được module nhân, không gắn được cổng đặc quyền — phần lớn đường leo thang đóng lại ngay ở đây.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cho hệ tệp gốc thành chỉ-đọc</span><span class="lz-d"><code>--read-only</code> cộng một <code>tmpfs</code> cho những đường thật sự cần ghi. Kẻ tấn công vào được cũng chẳng để lại được gì.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Bỏ hết capability, chỉ giữ cái đang dùng</span><span class="lz-d"><code>--cap-drop ALL</code>, rồi thêm lại một hai cái mà tiến trình thật sự cần. Phần lớn container ứng dụng chẳng cần cái nào.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Rồi kiểm xem bạn còn để hở cái gì</span><span class="lz-d"><code>--privileged</code>, một socket Docker được mount vào, hay mạng của host — mỗi cái đều huỷ sạch mọi thứ ở trên chỉ bằng một cờ.</span></div>
</div>
<a class="link-card" href="https://docs.docker.com/engine/security/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">An ninh của Docker</span><span class="lc-sub">Bộ capability mặc định, hồ sơ seccomp, bề mặt tấn công của tiến trình nền là gì, và một bản tường thuật trung thực về việc ranh giới container bảo vệ và không bảo vệ được gì.</span></span>
</a>
<a class="link-card" href="https://github.com/docker/docker-bench-security" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">docker-bench-security</span><span class="lc-sub">Một script soát một máy chủ cùng các container của nó theo CIS Docker Benchmark. Hãy chạy nó một lần trên bất kỳ máy chủ nào bạn sở hữu; output chính là một danh sách việc cần làm.</span></span>
</a>
<a class="link-card" href="https://github.com/Tecnativa/docker-socket-proxy" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">docker-socket-proxy</span><span class="lc-sub">Nếu có thứ thật sự cần cái socket — Traefik, một agent giám sát — thì cái này đứng chắn phía trước và chỉ cho phép những endpoint bạn liệt kê. Tốt hơn hẳn việc trao đi quyền root.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: gia cố nó lại</span><span class="lc-sub">Bài chấm điểm: làm cho một container chạy chỉ-đọc rồi tìm ra những đường dẫn nó thật sự ghi, bỏ hết capability rồi thêm lại đúng cái nào hỏng, soát năm container đang chạy, và chứng minh vì sao một cái socket được gắn vào chính là root.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> thêm <code>USER node</code> vào một cái ảnh mà ứng dụng ghi vào một thư mục thuộc sở hữu root. Lượt dựng thành công, cái ảnh trên giấy tờ thì nhỏ hơn và an toàn hơn, và container chết lúc khởi động với <code>EACCES: permission denied, open '/app/logs/app.log'</code> — hoặc tệ hơn, khởi động ngon lành rồi hỏng vài giờ sau ở lần ghi đầu tiên. Hai thứ ngăn được nó: <code>COPY --chown</code> cho MỌI đường dẫn ứng dụng sở hữu, và chạy container một lần với <code>--read-only</code> TRƯỚC khi đem đi, vì khi đó bất cứ thứ gì cần ghi sẽ hỏng ngay lập tức và lộ ra thay vì hỏng lúc 3 giờ sáng. <code>docker diff</code> trên một container đang chạy bình thường liệt kê chính xác những đường dẫn cần khai báo.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Mặc định KHÔNG có user namespace, nên root trong container là root trên máy chủ — <code>USER</code> với một UID số cao là dòng giá trị nhất trong một Dockerfile, chỉ sau dòng chọn ảnh nền. <code>--read-only</code> cộng một <code>--tmpfs</code> cho vài đường dẫn cần ghi chặn được phần lớn thứ mà kẻ tấn công sẽ làm tiếp theo, và chỉ tốn công liệt kê chúng ra. Và <code>--privileged</code> hay một cái <code>docker.sock</code> được gắn vào chính là root trên máy chủ: đôi khi cần thiết, không bao giờ được tuỳ tiện.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.5 ─────────────────────────── */
    {
      title: '6.5 — Scanning, SBOMs and supply chain|||6.5 — Quét lỗ hổng, SBOM và chuỗi cung ứng',
      slug: 'dk-6-5-quet-chuoi-cung-ung',
      type: 'LESSON',
      description: 'Quét một cái ảnh bằng docker scout và trivy, đọc kết quả mà không hoảng, phân loại cái nào thật sự quan trọng, sinh SBOM và chứng thực xuất xứ, và một cổng chặn CI hợp lý.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>Scanning, SBOMs and supply chain</h2>
<p class="lead">Every image you ship contains software you did not write: a base OS, a language runtime, and a few hundred dependencies. Scanning tells you which of those have known vulnerabilities. The hard part is not running the scanner — it is reading the output without either panicking at 400 findings or ignoring the three that matter.</p>

<h3>Scan an image</h3>
<pre><code>docker scout cves app:1.4.2 2&gt;/dev/null | head -14</code></pre>
<div class="out">    ✓ Image stored for indexing
    ✓ Indexed 214 packages
    ✗ Detected 3 vulnerable packages with 5 vulnerabilities

## Overview
                    │              Analyzed Image
────────────────────┼──────────────────────────────
  Target            │  app:1.4.2
    digest          │  7f3a2b1c9d8e
    platform        │ linux/amd64
    provenance      │ https://github.com/me/app
    vulnerabilities │    0C     2H     3M     0L
    size            │ 196 MB
    packages        │ 214</div>
<pre><code><span class="tok-comment"># trivy — the other one everyone uses; no account needed</span>
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
  aquasec/trivy:latest image --severity HIGH,CRITICAL --ignore-unfixed app:1.4.2 2&gt;/dev/null \\
  | tail -8</code></pre>
<div class="out">app:1.4.2 (alpine 3.20.3)
Total: 0 (HIGH: 0, CRITICAL: 0)

Node.js (node-pkg)
Total: 2 (HIGH: 2, CRITICAL: 0)

┌──────────────┬────────────────┬──────────┬────────┬───────────────┬───────────────┐
│   Library    │ Vulnerability  │ Severity │ Status │ Installed Ver │  Fixed Ver    │
│ tar-fs       │ CVE-2026-31145 │ HIGH     │ fixed  │ 2.1.1         │ 2.1.2, 3.0.7  │
│ cross-spawn  │ CVE-2026-21538 │ HIGH     │ fixed  │ 7.0.3         │ 7.0.5         │
└──────────────┴────────────────┴──────────┴────────┴───────────────┴───────────────┘</div>
<div class="kv-grid">
  <div class="kv"><span class="k">docker scout</span><span class="v">Built into Docker Desktop and the CLI. Best integration — <code>compare</code>, <code>recommendations</code>, and it understands provenance. Requires a Docker Hub account for some features.</span></div>
  <div class="kv"><span class="k">trivy</span><span class="v">Open source, no account, runs anywhere, and scans images, filesystems, Git repos and Kubernetes manifests with the same tool. The most common choice in CI.</span></div>
  <div class="kv"><span class="k">grype</span><span class="v">Anchore's scanner, pairs with <code>syft</code> for SBOMs. Worth knowing about; its output format is easy to script against.</span></div>
  <div class="kv"><span class="k">Scanners disagree</span><span class="v">Different vulnerability databases and different matching heuristics. Two scanners reporting different counts on the same image is normal, not a bug in either.</span></div>
</div>

<h3>Reading the output without panicking</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Filter to fixable</span><span class="lz-t">--ignore-unfixed</span><span class="lz-d">A finding with no fixed version is not actionable today. It belongs on a watch list, not in a build gate — otherwise your gate fails for reasons nobody can resolve, and people start skipping it.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Separate base from application</span><span class="lz-t">alpine 3.20.3 versus node-pkg</span><span class="lz-d">Base OS findings are fixed by bumping the base image; dependency findings by bumping a package in your lockfile. Different owners, different fixes, different urgency.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Ask whether it is reachable</span><span class="lz-t">does your process ever call that code?</span><span class="lz-d">A CVE in an image-decoding library in an API that never decodes images is real but not exploitable in your context. Record the reasoning; do not silently ignore it.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Fix the cheap ones immediately</span><span class="lz-t">npm audit fix, or a base image bump</span><span class="lz-d">Most findings are fixed by a patch release that changes nothing else. Doing those routinely keeps the list short enough that the remaining ones get attention.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Track what you accept</span><span class="lz-t">.trivyignore with an expiry date and a reason</span><span class="lz-d">An accepted risk with a written reason and a review date is engineering. An ignored scanner is not.</span></div>
</div>
<pre><code><span class="tok-comment"># What would a newer base image fix?</span>
docker scout recommendations app:1.4.2 2&gt;/dev/null | head -10</code></pre>
<div class="out">  Recommended fixes for image app:1.4.2
  Base image is  node:22-alpine3.20

  │ Tag              │ Details                    │ Pushed  │ Vulnerabilities
  │ 22-alpine3.21    │ Newer base, same major     │ 6 days  │  0C  0H  0M  2L
  │ 22-alpine3.20    │ Current                    │ 3 weeks │  0C  0H  1M  6L
  Refresh base image · fixes 1 medium, 4 low</div>

<h3>An SBOM: what is actually in there</h3>
<pre><code><span class="tok-comment"># Generate one at build time and attach it to the image</span>
docker buildx build --sbom=true --provenance=mode=max \\
  -t ghcr.io/me/app:1.4.2 --push .

<span class="tok-comment"># Or read one from an existing image</span>
docker scout sbom --format list app:1.4.2 2&gt;/dev/null | head -6
docker buildx imagetools inspect ghcr.io/me/app:1.4.2 --format '{{ json .SBOM.SPDX.packages }}' \\
  | jq -r '.[] | "\\(.name) \\(.versionInfo)"' | head -5</code></pre>
<div class="out">Name              Version      Type
alpine-baselayout 3.6.5-r0     apk
busybox           1.36.1-r29   apk
express           4.21.1       npm
node              22.11.0      binary
openssl           3.3.2-r0     apk</div>
<div class="kv-grid">
  <div class="kv"><span class="k">What an SBOM is for</span><span class="v">The question "are we affected by the new <code>libxyz</code> vulnerability?" answered in seconds across every image you have shipped, without rebuilding or re-scanning anything.</span></div>
  <div class="kv"><span class="k">Attached, not stored separately</span><span class="v"><code>--sbom=true</code> attaches it to the image in the registry as an attestation. It travels with the image, so whoever pulls it can verify what is inside.</span></div>
  <div class="kv"><span class="k">Provenance</span><span class="v"><code>--provenance=mode=max</code> records how the image was built: the source repository, the commit, the builder, the Dockerfile. This is what <code>docker scout</code> printed as <code>provenance</code> in the overview above.</span></div>
  <div class="kv"><span class="k">The unknown/unknown manifest</span><span class="v">Attestations appear in the image index as a platform-less entry (Lesson 3.4). Harmless, and the reason some older tooling needs <code>--provenance=false</code>.</span></div>
  <div class="kv"><span class="k">syft, if you are not on Docker</span><span class="v"><code>syft app:1.4.2 -o spdx-json</code> produces the same thing as a standalone tool, in whichever standard format your policy requires.</span></div>
</div>

<h3>Signing, briefly</h3>
<pre><code><span class="tok-comment"># Sign with cosign, keyless (identity comes from the CI's OIDC token)</span>
cosign sign --yes ghcr.io/me/app@sha256:7f3a2b1c9d8e…

<span class="tok-comment"># Verify before deploying — this is the half that matters</span>
cosign verify \\
  --certificate-identity-regexp 'https://github.com/me/app/.github/workflows/.*' \\
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \\
  ghcr.io/me/app@sha256:7f3a2b1c9d8e… | jq -r '.[0].optional.Subject'</code></pre>
<div class="out">https://github.com/me/app/.github/workflows/build.yml@refs/heads/main</div>
<p>A signature answers "was this image built by our pipeline from our repository?" — which a tag cannot, since anyone with push access can move a tag. Keyless signing means there is no key to manage or leak: the identity is the CI workflow itself. Note that <strong>signing without verifying achieves nothing</strong>; the verification step belongs in the deploy, not in the build.</p>

<h3>A sensible CI gate</h3>
<pre><code>- name: Scan image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ghcr.io/\${{ github.repository }}:\${{ github.sha }}
    severity: HIGH,CRITICAL
    ignore-unfixed: true
    exit-code: '1'
    trivyignores: .trivyignore</code></pre>
<pre><code><span class="tok-comment"># .trivyignore — accepted risks, with a reason and an expiry</span>
# CVE-2026-31145 — tar-fs, only reachable from the CLI which we do not ship.
# Review by 2026-10-01, or when tar-fs 3.x lands upstream.
CVE-2026-31145</code></pre>
<div class="callout ok"><strong>Fail on HIGH and CRITICAL <em>that have a fix</em>, and nothing else.</strong> A gate that fails on everything gets disabled within a month; a gate that fails only on actionable, serious findings gets fixed. Pair it with a weekly scheduled rebuild (Lesson 3.2) so base-image patches arrive without anyone pushing code, and with a scan of the <em>running</em> production image, not just the one CI just built — those drift apart the moment a deploy is skipped.</div>

<h3>The habits that matter more than the tool</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rebuild on a schedule</span><span class="v">Most base-image CVEs are fixed upstream within days. A weekly <code>--pull</code> rebuild collects those fixes with no human involvement, and is worth more than any scanner.</span></div>
  <div class="kv"><span class="k">Keep the image small</span><span class="v">Fewer packages, fewer CVEs — mechanically. The 152MB distroless image from Lesson 6.3 has a fraction of the findings of the 1.24GB one, for the same application.</span></div>
  <div class="kv"><span class="k">Pin with a bot, not by hand</span><span class="v">Digest pinning plus Renovate (Lesson 3.2) gives you reproducibility <em>and</em> updates. Pinning without the bot is how an image ends up two years old.</span></div>
  <div class="kv"><span class="k">Scan the lockfile too</span><span class="v"><code>npm audit</code>, <code>pip-audit</code>, <code>govulncheck</code> run in seconds and catch things earlier than an image scan, because they run before the image exists.</span></div>
  <div class="kv"><span class="k">Watch what you copy in</span><span class="v"><code>COPY --from=some/image</code> and <code>curl | sh</code> in a <code>RUN</code> are supply-chain entry points that no scanner will question. Pin them by digest and verify checksums (Lesson 4.2).</span></div>
</div>

<a class="link-card" href="https://docs.docker.com/scout/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">Docker Scout</span><span class="lc-sub"><code>cves</code>, <code>compare</code>, <code>recommendations</code> and policy evaluation. The <code>compare</code> subcommand — diffing two images' vulnerabilities — is genuinely useful before a base-image bump.</span></span>
</a>
<a class="link-card" href="https://trivy.dev/" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Trivy</span><span class="lc-sub">Images, filesystems, repositories, IaC and secrets in one scanner, with a GitHub Action and sensible defaults. The pragmatic choice for CI.</span></span>
</a>
<a class="link-card" href="https://docs.sigstore.dev/cosign/signing/overview/" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">cosign — signing container images</span><span class="lc-sub">Keyless signing with OIDC, and — more importantly — the verification policies that make a signature mean something at deploy time.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: scan and triage</span><span class="lc-sub">Graded exercises: scan an image and separate base findings from dependency findings, decide which of five CVEs to fix today, write a <code>.trivyignore</code> entry that a reviewer would accept, and read an SBOM to answer "do we ship openssl 3.3?".</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> treating the CVE count as the score. Chasing zero produces two bad outcomes: people switch to a base image that is smaller but wrong for their dependencies (Lesson 6.2), and people add blanket ignores to make a red build green. Neither improves security. The count is a starting point for a conversation, and the questions that matter are: is there a fix available, is the vulnerable code path reachable from our application, and how long has this been in production. An image with 40 unfixable low-severity findings in libraries you never call is in better shape than one with 3 findings you have been ignoring for eight months because the build gate was too noisy to keep on.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Filter to <em>fixable</em> HIGH and CRITICAL before you form an opinion — a gate that fires on unfixable findings gets switched off, and then nothing is checked. Separate base-image findings (fixed by bumping the base) from dependency findings (fixed in your lockfile), because they have different owners and different fixes. And a scheduled rebuild with <code>--pull</code> plus a digest-pinning bot delivers more security than any scanner, because it fixes things without anyone having to notice.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Quét lỗ hổng, SBOM và chuỗi cung ứng</h2>
<p class="lead">Mỗi cái ảnh bạn đẩy lên đều chứa phần mềm bạn không viết: một hệ điều hành nền, một bộ chạy ngôn ngữ, và vài trăm gói phụ thuộc. Quét lỗ hổng cho bạn biết cái nào trong số đó có lỗ hổng đã công bố. Phần khó không phải chạy máy quét — mà là đọc kết quả mà không hoảng loạn trước 400 phát hiện, cũng không bỏ qua ba cái thật sự quan trọng.</p>

<h3>Quét một cái ảnh</h3>
<pre><code>docker scout cves app:1.4.2 2&gt;/dev/null | head -14</code></pre>
<div class="out">    ✓ Image stored for indexing
    ✓ Indexed 214 packages
    ✗ Detected 3 vulnerable packages with 5 vulnerabilities

## Overview
                    │              Analyzed Image
────────────────────┼──────────────────────────────
  Target            │  app:1.4.2
    digest          │  7f3a2b1c9d8e
    platform        │ linux/amd64
    provenance      │ https://github.com/me/app
    vulnerabilities │    0C     2H     3M     0L
    size            │ 196 MB
    packages        │ 214</div>
<pre><code><span class="tok-comment"># trivy — cái còn lại ai cũng dùng; không cần tài khoản</span>
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
  aquasec/trivy:latest image --severity HIGH,CRITICAL --ignore-unfixed app:1.4.2 2&gt;/dev/null \\
  | tail -8</code></pre>
<div class="out">app:1.4.2 (alpine 3.20.3)
Total: 0 (HIGH: 0, CRITICAL: 0)

Node.js (node-pkg)
Total: 2 (HIGH: 2, CRITICAL: 0)

┌──────────────┬────────────────┬──────────┬────────┬───────────────┬───────────────┐
│   Library    │ Vulnerability  │ Severity │ Status │ Installed Ver │  Fixed Ver    │
│ tar-fs       │ CVE-2026-31145 │ HIGH     │ fixed  │ 2.1.1         │ 2.1.2, 3.0.7  │
│ cross-spawn  │ CVE-2026-21538 │ HIGH     │ fixed  │ 7.0.3         │ 7.0.5         │
└──────────────┴────────────────┴──────────┴────────┴───────────────┴───────────────┘</div>
<div class="kv-grid">
  <div class="kv"><span class="k">docker scout</span><span class="v">Có sẵn trong Docker Desktop và CLI. Tích hợp tốt nhất — <code>compare</code>, <code>recommendations</code>, và nó hiểu được xuất xứ (provenance). Vài tính năng cần tài khoản Docker Hub.</span></div>
  <div class="kv"><span class="k">trivy</span><span class="v">Mã nguồn mở, không cần tài khoản, chạy được ở mọi nơi, và quét ảnh, hệ thống file, kho Git lẫn manifest Kubernetes bằng cùng một công cụ. Lựa chọn phổ biến nhất trong CI.</span></div>
  <div class="kv"><span class="k">grype</span><span class="v">Máy quét của Anchore, đi cặp với <code>syft</code> để sinh SBOM. Đáng biết; định dạng kết quả của nó dễ viết script để xử lý.</span></div>
  <div class="kv"><span class="k">Các máy quét bất đồng nhau</span><span class="v">Cơ sở dữ liệu lỗ hổng khác nhau và cách đối chiếu khác nhau. Hai máy quét báo số khác nhau trên cùng một cái ảnh là chuyện bình thường, không phải lỗi của bên nào.</span></div>
</div>

<h3>Đọc kết quả mà không hoảng</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Lọc lấy cái sửa được</span><span class="lz-t">--ignore-unfixed</span><span class="lz-d">Một phát hiện chưa có phiên bản vá thì hôm nay bạn không làm gì được. Nó thuộc về danh sách theo dõi, không thuộc về cổng chặn build — nếu không cổng của bạn sẽ đỏ vì lý do không ai giải quyết nổi, rồi người ta bắt đầu bỏ qua nó.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Tách nền khỏi ứng dụng</span><span class="lz-t">alpine 3.20.3 so với node-pkg</span><span class="lz-d">Lỗi ở hệ điều hành nền sửa bằng cách nâng ảnh nền; lỗi ở gói phụ thuộc sửa bằng cách nâng một gói trong lockfile. Khác người chịu trách nhiệm, khác cách sửa, khác độ gấp.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Hỏi xem có với tới được không</span><span class="lz-t">tiến trình của bạn có bao giờ gọi vào đoạn mã đó không?</span><span class="lz-d">Một CVE trong thư viện giải mã ảnh, nằm trong một API không bao giờ giải mã ảnh, là có thật nhưng không khai thác được trong ngữ cảnh của bạn. Hãy ghi lại lập luận đó; đừng lặng lẽ bỏ qua.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Sửa ngay những cái rẻ</span><span class="lz-t">npm audit fix, hoặc nâng ảnh nền</span><span class="lz-d">Phần lớn phát hiện được vá bằng một bản patch không đổi gì khác. Làm đều đặn việc đó giữ cho danh sách đủ ngắn để những cái còn lại được chú ý.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Ghi lại cái bạn chấp nhận</span><span class="lz-t">.trivyignore kèm ngày hết hạn và lý do</span><span class="lz-d">Một rủi ro được chấp nhận có lý do viết ra và ngày xem lại là kỹ thuật. Một máy quét bị phớt lờ thì không.</span></div>
</div>
<pre><code><span class="tok-comment"># Một ảnh nền mới hơn sẽ vá được những gì?</span>
docker scout recommendations app:1.4.2 2&gt;/dev/null | head -10</code></pre>
<div class="out">  Recommended fixes for image app:1.4.2
  Base image is  node:22-alpine3.20

  │ Tag              │ Details                    │ Pushed  │ Vulnerabilities
  │ 22-alpine3.21    │ Newer base, same major     │ 6 days  │  0C  0H  0M  2L
  │ 22-alpine3.20    │ Current                    │ 3 weeks │  0C  0H  1M  6L
  Refresh base image · fixes 1 medium, 4 low</div>

<h3>SBOM: bên trong thật sự có gì</h3>
<pre><code><span class="tok-comment"># Sinh lúc build và gắn kèm vào ảnh</span>
docker buildx build --sbom=true --provenance=mode=max \\
  -t ghcr.io/me/app:1.4.2 --push .

<span class="tok-comment"># Hoặc đọc từ một cái ảnh đã có</span>
docker scout sbom --format list app:1.4.2 2&gt;/dev/null | head -6
docker buildx imagetools inspect ghcr.io/me/app:1.4.2 --format '{{ json .SBOM.SPDX.packages }}' \\
  | jq -r '.[] | "\\(.name) \\(.versionInfo)"' | head -5</code></pre>
<div class="out">Name              Version      Type
alpine-baselayout 3.6.5-r0     apk
busybox           1.36.1-r29   apk
express           4.21.1       npm
node              22.11.0      binary
openssl           3.3.2-r0     apk</div>
<div class="kv-grid">
  <div class="kv"><span class="k">SBOM để làm gì</span><span class="v">Câu hỏi "chúng ta có dính lỗ hổng <code>libxyz</code> mới công bố không?" được trả lời trong vài giây, trên mọi cái ảnh đã từng đẩy lên, mà không phải dựng lại hay quét lại thứ gì.</span></div>
  <div class="kv"><span class="k">Gắn kèm, không lưu rời</span><span class="v"><code>--sbom=true</code> gắn nó vào cái ảnh trong registry dưới dạng chứng thực (attestation). Nó đi theo cái ảnh, nên ai kéo về cũng kiểm được bên trong có gì.</span></div>
  <div class="kv"><span class="k">Xuất xứ (provenance)</span><span class="v"><code>--provenance=mode=max</code> ghi lại cái ảnh được dựng thế nào: kho nguồn, commit, máy dựng, Dockerfile. Đó chính là dòng <code>provenance</code> mà <code>docker scout</code> in ra ở bảng tổng quan phía trên.</span></div>
  <div class="kv"><span class="k">Manifest unknown/unknown</span><span class="v">Chứng thực xuất hiện trong chỉ mục ảnh dưới dạng một mục không có nền tảng (Bài 3.4). Vô hại, và đó là lý do vài công cụ cũ cần <code>--provenance=false</code>.</span></div>
  <div class="kv"><span class="k">syft, nếu bạn không dùng Docker</span><span class="v"><code>syft app:1.4.2 -o spdx-json</code> cho ra đúng thứ đó dưới dạng công cụ độc lập, theo định dạng chuẩn nào mà chính sách của bạn yêu cầu.</span></div>
</div>

<h3>Ký ảnh, nói ngắn</h3>
<pre><code><span class="tok-comment"># Ký bằng cosign, không cần khoá (danh tính lấy từ token OIDC của CI)</span>
cosign sign --yes ghcr.io/me/app@sha256:7f3a2b1c9d8e…

<span class="tok-comment"># Kiểm chữ ký trước khi triển khai — đây mới là nửa quan trọng</span>
cosign verify \\
  --certificate-identity-regexp 'https://github.com/me/app/.github/workflows/.*' \\
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \\
  ghcr.io/me/app@sha256:7f3a2b1c9d8e… | jq -r '.[0].optional.Subject'</code></pre>
<div class="out">https://github.com/me/app/.github/workflows/build.yml@refs/heads/main</div>
<p>Một chữ ký trả lời câu "cái ảnh này có phải do đường ống của chúng ta dựng từ kho của chúng ta không?" — điều mà một cái nhãn không trả lời được, vì ai có quyền đẩy cũng dời được nhãn. Ký không khoá nghĩa là không có khoá nào để quản hay để lộ: danh tính chính là cái workflow CI. Nhớ rằng <strong>ký mà không kiểm thì chẳng được gì</strong>; bước kiểm thuộc về lúc triển khai, không phải lúc dựng.</p>

<h3>Một cổng chặn CI hợp lý</h3>
<pre><code>- name: Scan image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ghcr.io/\${{ github.repository }}:\${{ github.sha }}
    severity: HIGH,CRITICAL
    ignore-unfixed: true
    exit-code: '1'
    trivyignores: .trivyignore</code></pre>
<pre><code><span class="tok-comment"># .trivyignore — rủi ro đã chấp nhận, kèm lý do và hạn xem lại</span>
# CVE-2026-31145 — tar-fs, chỉ với tới được từ CLI mà chúng ta không đóng gói.
# Xem lại trước 01/10/2026, hoặc khi tar-fs 3.x lên bản chính thức.
CVE-2026-31145</code></pre>
<div class="callout ok"><strong>Chỉ chặn ở HIGH và CRITICAL <em>đã có bản vá</em>, không chặn gì khác.</strong> Một cổng chặn mọi thứ sẽ bị tắt trong vòng một tháng; một cổng chỉ đỏ khi có phát hiện nghiêm trọng và làm được gì đó thì sẽ được sửa. Ghép nó với một lượt dựng lại theo lịch hằng tuần (Bài 3.2) để bản vá của ảnh nền tự về mà không cần ai đẩy mã, và với một lượt quét chính cái ảnh <em>đang chạy</em> trên production, chứ không chỉ cái CI vừa dựng — hai cái đó lệch nhau ngay từ lần đầu có người bỏ qua một lượt deploy.</div>

<h3>Những thói quen quan trọng hơn công cụ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dựng lại theo lịch</span><span class="v">Phần lớn CVE của ảnh nền được vá ở thượng nguồn trong vài ngày. Một lượt dựng lại <code>--pull</code> mỗi tuần gom hết chỗ vá đó mà không cần người can thiệp, và đáng giá hơn mọi máy quét.</span></div>
  <div class="kv"><span class="k">Giữ ảnh nhỏ</span><span class="v">Ít gói hơn thì ít CVE hơn — thuần cơ học. Cái ảnh distroless 152MB ở Bài 6.3 có số phát hiện chỉ bằng một phần nhỏ so với cái 1,24GB, cho cùng một ứng dụng.</span></div>
  <div class="kv"><span class="k">Ghim bằng bot, đừng ghim tay</span><span class="v">Ghim theo digest cộng với Renovate (Bài 3.2) cho bạn cả tính tái lập <em>lẫn</em> bản cập nhật. Ghim mà không có bot là cách một cái ảnh nằm nguyên hai năm.</span></div>
  <div class="kv"><span class="k">Quét cả lockfile</span><span class="v"><code>npm audit</code>, <code>pip-audit</code>, <code>govulncheck</code> chạy trong vài giây và bắt được sớm hơn quét ảnh, vì chúng chạy trước cả khi cái ảnh tồn tại.</span></div>
  <div class="kv"><span class="k">Để ý thứ bạn chép vào</span><span class="v"><code>COPY --from=some/image</code> và <code>curl | sh</code> trong một lệnh <code>RUN</code> là cửa vào của chuỗi cung ứng mà không máy quét nào chất vấn. Ghim chúng theo digest và kiểm checksum (Bài 4.2).</span></div>
</div>

<a class="link-card" href="https://docs.docker.com/scout/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">Docker Scout</span><span class="lc-sub"><code>cves</code>, <code>compare</code>, <code>recommendations</code> và đánh giá theo chính sách. Lệnh con <code>compare</code> — so lỗ hổng của hai cái ảnh — thật sự hữu ích trước khi nâng ảnh nền.</span></span>
</a>
<a class="link-card" href="https://trivy.dev/" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Trivy</span><span class="lc-sub">Ảnh, hệ thống file, kho mã, IaC và bí mật trong cùng một máy quét, có sẵn GitHub Action và mặc định hợp lý. Lựa chọn thực dụng cho CI.</span></span>
</a>
<a class="link-card" href="https://docs.sigstore.dev/cosign/signing/overview/" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">cosign — ký ảnh container</span><span class="lc-sub">Ký không khoá bằng OIDC, và — quan trọng hơn — những chính sách kiểm chữ ký khiến một chữ ký thật sự có ý nghĩa lúc triển khai.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: quét và phân loại</span><span class="lc-sub">Bài chấm điểm: quét một cái ảnh rồi tách phát hiện của nền khỏi phát hiện của gói phụ thuộc, quyết định trong năm CVE cái nào sửa hôm nay, viết một dòng <code>.trivyignore</code> mà người review chấp nhận được, và đọc SBOM để trả lời "chúng ta có đóng gói openssl 3.3 không?".</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> coi số lượng CVE là điểm số. Đuổi theo con số 0 đẻ ra hai hậu quả tồi: người ta đổi sang một cái ảnh nền nhỏ hơn nhưng sai với gói phụ thuộc của mình (Bài 6.2), và người ta thêm những dòng bỏ qua vơ đũa cả nắm để build đỏ thành xanh. Không cái nào cải thiện an toàn cả. Con số chỉ là điểm khởi đầu cho một cuộc trao đổi, còn những câu hỏi thật sự quan trọng là: đã có bản vá chưa, đoạn mã dính lỗ hổng có với tới được từ ứng dụng của chúng ta không, và thứ này đã nằm trên production bao lâu rồi. Một cái ảnh có 40 phát hiện mức thấp chưa có bản vá nằm trong những thư viện bạn không bao giờ gọi tới thì lành mạnh hơn một cái ảnh có 3 phát hiện mà bạn đã ngó lơ tám tháng vì cổng chặn ồn quá nên bị tắt.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Lọc lấy HIGH và CRITICAL <em>đã có bản vá</em> trước khi bạn có ý kiến — một cổng chặn nổ vì những phát hiện không vá được sẽ bị tắt, và rồi chẳng còn gì được kiểm. Tách phát hiện của ảnh nền (sửa bằng cách nâng nền) khỏi phát hiện của gói phụ thuộc (sửa trong lockfile), vì chúng khác người chịu trách nhiệm và khác cách sửa. Và một lượt dựng lại theo lịch có <code>--pull</code> cộng với một con bot ghim digest mang lại nhiều an toàn hơn mọi máy quét, vì nó vá mà không cần ai phải để ý.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.6 ─────────────────────────── */
    {
      title: '6.6 — Quiz: small, safe images|||6.6 — Trắc nghiệm: ảnh nhỏ, ảnh an toàn',
      slug: 'dk-6-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về multi-stage, lớp cộng dồn, musl với glibc, USER, distroless, cổng chặn quét lỗ hổng và thói quen giữ ảnh sạch.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on size and safety. Every one comes from a mistake that is easy to make and expensive to find later: an image that is large for a reason you cannot see, a base image that dies in production, a container running as root because nobody said otherwise, and a scanner report nobody reads.</p>
<div class="callout ok">Aim for 7/8. The three that matter most: why <code>rm</code> in a later layer makes the image <em>bigger</em> (6.3), why a glibc binary on musl is a green build that cannot run (6.2), and why a gate that fails on everything ends up checking nothing (6.5).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Tám câu về kích thước và an toàn. Câu nào cũng bắt nguồn từ một lỗi dễ mắc và tốn công tìm về sau: một cái ảnh phình to vì lý do bạn không nhìn thấy, một cái ảnh nền chết trên production, một container chạy bằng root vì không ai bảo nó đừng, và một báo cáo quét lỗ hổng không ai đọc.</p>
<div class="callout ok">Nhắm 7/8. Ba câu quan trọng nhất: vì sao <code>rm</code> ở lớp sau lại làm ảnh <em>to ra</em> (6.3), vì sao một tệp nhị phân glibc trên musl là bản dựng xanh mà không chạy được (6.2), và vì sao một cổng chặn đỏ với mọi thứ rốt cuộc chẳng kiểm được gì (6.5).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A multi-stage Dockerfile builds in a first stage and copies the result into a second. Why is the final image smaller, even though the same commands ran?|||Một Dockerfile multi-stage dựng ở tầng thứ nhất rồi chép kết quả sang tầng thứ hai. Vì sao ảnh cuối nhỏ hơn, dù vẫn chạy đúng những lệnh đó?',
            options: [
              'Docker automatically compresses images that have more than one stage|||Docker tự nén những cái ảnh có nhiều hơn một tầng',
              'The second stage runs a deduplication pass that removes files the first stage created|||Tầng thứ hai chạy một lượt khử trùng lặp để xoá những file mà tầng thứ nhất tạo ra',
              'Only the final stage’s layers are shipped — compilers, headers and dev dependencies stay behind because nothing COPY --from copies them forward, not because anything deleted them|||Chỉ những lớp của tầng CUỐI được đóng gói — trình biên dịch, file header và gói phụ thuộc dev nằm lại phía sau vì không có COPY --from nào chép chúng đi tiếp, chứ không phải vì có thứ gì xoá chúng',
              'Multi-stage builds delete the build tools with an implicit RUN rm at the end of each stage|||Multi-stage tự xoá công cụ dựng bằng một lệnh RUN rm ngầm ở cuối mỗi tầng',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You add `RUN rm -rf /usr/local/lib/node_modules/npm` as the last instruction of a single-stage Dockerfile. The image is 4MB *larger* than before. Why?|||Bạn thêm `RUN rm -rf /usr/local/lib/node_modules/npm` làm lệnh cuối của một Dockerfile một tầng. Ảnh *to hơn* 4MB so với trước. Vì sao?',
            options: [
              'Layers are additive: the earlier layer still holds every byte, and the new layer only adds whiteout entries marking those files deleted — to actually remove something, delete it in the SAME RUN that created it, or never put it there (multi-stage)|||Các lớp chỉ cộng thêm: lớp trước vẫn giữ nguyên từng byte, còn lớp mới chỉ thêm những mục whiteout đánh dấu các file đó đã bị xoá — muốn xoá thật thì xoá ngay trong CHÍNH lệnh RUN đã tạo ra nó, hoặc đừng đưa nó vào (multi-stage)',
              'rm -rf on a Docker layer is a no-op and Docker logs a warning you missed|||rm -rf trên một lớp Docker không có tác dụng và Docker có ghi một cảnh báo mà bạn bỏ sót',
              'Removing npm forced Docker to rebuild every earlier layer without cache|||Việc xoá npm buộc Docker dựng lại mọi lớp trước đó mà không dùng cache',
              'npm reinstalls itself on the next layer when it detects it is missing|||npm tự cài lại ở lớp sau khi phát hiện nó bị thiếu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You switch a Node.js image from `node:22-slim` to `node:22-alpine`. The build is green, the push is green, and the container then restarts forever with an error about a Prisma engine and a missing shared library. What happened?|||Bạn đổi ảnh Node.js từ `node:22-slim` sang `node:22-alpine`. Dựng xanh, đẩy xanh, rồi container restart vô tận với lỗi về engine Prisma và một thư viện chia sẻ bị thiếu. Chuyện gì đã xảy ra?',
            options: [
              'Alpine images do not include Node.js, only the package manager|||Ảnh Alpine không kèm Node.js, chỉ có trình quản lý gói',
              'Alpine uses musl libc, not glibc — a prebuilt native binary compiled for glibc cannot load there, which is why a green build does not mean a runnable image|||Alpine dùng musl libc chứ không phải glibc — một tệp nhị phân gốc dựng sẵn cho glibc không nạp được ở đó, và đó là lý do build xanh không có nghĩa là ảnh chạy được',
              'Alpine forbids native modules for security reasons|||Alpine cấm module gốc vì lý do an toàn',
              'The alpine tag is published only for arm64 and you are on amd64|||Nhãn alpine chỉ được phát hành cho arm64 còn bạn đang chạy amd64',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which statement about `USER node` in a Dockerfile is correct?|||Phát biểu nào về `USER node` trong Dockerfile là đúng?',
            options: [
              'It only affects `docker exec`; the main process still runs as root|||Nó chỉ ảnh hưởng tới `docker exec`; tiến trình chính vẫn chạy bằng root',
              'It is ignored unless the run command also passes `--user`|||Nó bị bỏ qua trừ khi lệnh chạy cũng truyền `--user`',
              'It applies from that line onward, including the container’s main process — so anything the app writes to must already be owned by that user, via COPY --chown or a chown placed before the USER line|||Nó áp dụng từ dòng đó trở đi, kể cả tiến trình chính của container — nên mọi thứ ứng dụng cần ghi phải đã thuộc quyền sở hữu của người dùng đó, bằng COPY --chown hoặc một lệnh chown đặt trước dòng USER',
              'It drops privileges but still allows binding to port 80 inside the container|||Nó hạ quyền nhưng vẫn cho phép gắn vào cổng 80 bên trong container',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'What is the practical trade-off of a distroless runtime image for a compiled binary?|||Đánh đổi thực tế của một ảnh runtime distroless cho một tệp nhị phân đã biên dịch là gì?',
            options: [
              'There is no shell and no package manager, so the tools an attacker would use are absent — and so are the ones you would use, which is why you keep a debug stage and reach it with --target debug|||Không có shell lẫn trình quản lý gói, nên công cụ kẻ tấn công cần đều vắng mặt — và công cụ BẠN cần cũng vậy, nên hãy giữ một tầng debug và gọi tới nó bằng --target debug',
              'Distroless images cannot run statically linked binaries|||Ảnh distroless không chạy được tệp nhị phân liên kết tĩnh',
              'Alpine images are always smaller than distroless ones|||Ảnh alpine luôn nhỏ hơn ảnh distroless',
              'Distroless requires a paid Google Cloud subscription|||Distroless đòi phải có gói thuê bao Google Cloud trả phí',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Your CI scan gate is set to fail on any CVE of any severity. Three months later, what is the most likely state of the project?|||Cổng chặn quét lỗ hổng trong CI của bạn được đặt để đỏ với mọi CVE ở mọi mức. Ba tháng sau, tình trạng dự án nhiều khả năng là gì?',
            options: [
              'The image has zero vulnerabilities and the team is much safer|||Ảnh không còn lỗ hổng nào và cả nhóm an toàn hơn hẳn',
              'The scanner has learned which findings to suppress automatically|||Máy quét đã tự học được cần chặn bớt phát hiện nào',
              'CI runs faster because fewer builds reach the deploy stage|||CI chạy nhanh hơn vì ít bản dựng đi tới bước triển khai',
              'The gate has been disabled or bypassed and nothing is checked at all — fail only on HIGH/CRITICAL that HAVE a fix, record accepted risks in .trivyignore with a reason and a review date, watch the rest|||Cổng đã bị tắt hoặc bị đi vòng và chẳng còn gì được kiểm — chỉ nên chặn ở HIGH/CRITICAL ĐÃ CÓ bản vá, ghi rủi ro đã chấp nhận vào .trivyignore kèm lý do và ngày xem lại, phần còn lại đưa vào danh sách theo dõi',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'Two scanners report different vulnerability counts for the same image digest. What should you conclude?|||Hai máy quét báo số lỗ hổng khác nhau cho cùng một digest ảnh. Bạn nên kết luận thế nào?',
            options: [
              'Nothing is broken — different vulnerability databases and different package-matching heuristics make disagreement normal; pick one as the gate so the signal stays consistent and use the others as a second opinion|||Không có gì hỏng — cơ sở dữ liệu lỗ hổng khác nhau và cách đối chiếu gói khác nhau khiến chênh lệch là bình thường; hãy chọn một cái làm cổng chặn để tín hiệu nhất quán và dùng những cái khác như ý kiến thứ hai',
              'The image digest must have changed between the two scans|||Chắc chắn digest của ảnh đã đổi giữa hai lượt quét',
              'The scanner reporting more findings is always the correct one|||Máy quét báo nhiều phát hiện hơn luôn là máy đúng',
              'One of the scanners has a corrupt database and must be reinstalled|||Một trong hai máy quét có cơ sở dữ liệu hỏng và phải cài lại',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which single habit reduces the vulnerability count of your production images the most, for the least ongoing effort?|||Thói quen đơn lẻ nào giảm số lỗ hổng của ảnh production nhiều nhất mà tốn ít công duy trì nhất?',
            options: [
              'Adding more scanners to the pipeline so nothing is missed|||Thêm nhiều máy quét vào đường ống để không bỏ sót gì',
              'A scheduled weekly rebuild with --pull, so upstream base-image patches arrive without anyone pushing code — paired with digest pinning plus Renovate, so you get reproducibility AND updates|||Một lượt dựng lại theo lịch hằng tuần có --pull, để bản vá của ảnh nền ở thượng nguồn tự về mà không cần ai đẩy mã — ghép với ghim theo digest cộng Renovate, để vừa tái lập được VỪA cập nhật được',
              'Pinning every base image by digest and never changing it|||Ghim mọi ảnh nền theo digest rồi không bao giờ đổi',
              'Running the container with --privileged so security tooling inside it works correctly|||Chạy container bằng --privileged để công cụ an toàn bên trong hoạt động đúng',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
