/**
 * Node.js — Chương 17: Docker và triển khai.
 * Mọi output là đo thật: Docker 29.5.3 (Docker Desktop, macOS), node:22 /
 * node:22-slim / node:22-alpine, một app Express 5 + pg + zod.
 * Phần production lấy từ chính deploy.sh và Dockerfile của cuongthai.com.
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 17 — Docker and deployment|||Chương 17 — Docker và triển khai',
  description: 'Từ một ảnh 440MB xuống 58,8MB, vì sao CMD ["npm","start"] làm mất mọi request đang xử lý mỗi lần deploy, cái token vẫn còn nguyên trong ảnh sau khi bạn đã rm -f nó, và phép đo cho thấy "blue-green" không có proxy đứng trước vẫn mất 1,5% request.',
  lessons: [
    /* ─────────────────────────── 17.1 ─────────────────────────── */
    {
      title: '17.1 — The image: 440MB down to 58,8MB|||17.1 — Ảnh Docker: từ 440MB xuống 58,8MB',
      slug: 'nodejs-17-1-anh-docker',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-1-anh-docker.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-1-anh-docker.jpg',
        scenario: 'docker-container',
        durationSeconds: 25,
        caption: { en: "What a container actually is: layers, namespaces, limits", vi: "Container thực chất là gì: tầng, namespace, hạn mức" },
      },
      type: 'VIDEO',
      description: 'Build cùng một app bằng bốn kiểu Dockerfile và đo cỡ ảnh thật, rồi dựng multi-stage để loại toolchain và devDependencies ra khỏi thứ chạy ở production.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.1</span>
<h2>The image: 440MB down to 58,8MB</h2>
<p class="lead">A Docker image is not a packaging detail. It is downloaded on every deploy, stored on every host, scanned by every security tool, and its size is the difference between a rollback that takes ten seconds and one that takes four minutes while the site is down. This lesson builds the same application four ways and measures what each choice costs.</p>

<h3>Four Dockerfiles, one app</h3>
<p>The application is deliberately ordinary: Express 5, <code>pg</code>, <code>zod</code>, plus TypeScript and vitest as devDependencies. Same source, four images:</p>

<div class="out">ảnh nền (docker image inspect .Size):
  node:22              381,0 MB
  node:22-slim          76,2 MB
  node:22-alpine        55,4 MB

ảnh đã build:
  naive   (FROM node:22, COPY . ., npm install)    440,0 MB
  slim    (node:22-slim, npm ci --omit=dev)         79,6 MB
  alpine  (node:22-alpine, npm ci --omit=dev)       58,8 MB
  multi   (multi-stage trên node:22-slim)           77,5 MB</div>

<p><strong>440MB against 58,8MB — 7,5×</strong> for an application whose own code is four kilobytes. Almost the entire difference is the base image and what you chose to leave inside it.</p>

<div class="kv-grid">
  <div class="kv"><span>node:22</span><b>A full Debian plus a build toolchain plus git plus curl. 381MB before you write a single line</b></div>
  <div class="kv"><span>node:22-slim</span><b>A minimal Debian with NO toolchain. 76.2MB. The right default for most cases</b></div>
  <div class="kv"><span>node:22-alpine</span><b>55.4MB. The smallest, but it uses musl libc rather than glibc — native modules can break</b></div>
  <div class="kv"><span>distroless</span><b>Node plus your app only, with NO shell. The safest, and <code>docker exec ... sh</code> no longer works</b></div>
</div>

<div class="callout warn">
<p><strong>The alpine trap.</strong> Alpine uses musl instead of glibc. Pure-JavaScript packages do not care; native modules do — <code>sharp</code>, <code>bcrypt</code>, <code>canvas</code>, anything with a <code>.node</code> binary. They either fail to install, silently fall back to a slower pure-JS path, or install and then crash at runtime on a code path you did not test. The 20MB you save is real; so is the afternoon you spend on <code>Error loading shared library ld-linux-x86-64.so.2</code>. On a project that uses <code>sharp</code>, choose slim.</p>
</div>

<h3>What is actually inside the naive image</h3>
<p>The naive Dockerfile is four lines and every one of them is a mistake:</p>

<pre><code>FROM node:22           # ← 381MB, có cả gcc, make, python, git
WORKDIR /app
COPY . .               # ← copy CẢ node_modules của máy bạn (sai kiến trúc!)
RUN npm install        # ← cài luôn devDependencies: typescript, vitest
CMD ["npm", "start"]   # ← bài 17.3 sẽ chứng minh dòng này làm mất request</code></pre>

<p>The 59MB it adds on top of the base is <code>node_modules</code> with typescript and vitest in it — a compiler and a test runner, shipped to production, where nothing will ever run them. They are not merely dead weight: every package in the image is something a vulnerability scanner will report and a supply-chain attacker can use (chapter 4).</p>

<h3>Multi-stage: build somewhere you then throw away</h3>
<p>The tension is real — you <em>need</em> devDependencies to build and you <em>do not want</em> them in the result. Multi-stage resolves it by building in one image and copying only the output into another:</p>

<pre><code># ── giai đoạn 1: build (có devDependencies, có toolchain) ──
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci                       # ĐẦY ĐỦ, gồm cả devDependencies
COPY . .
RUN npm run build                # tsc, bundler, gì cũng được

# ── giai đoạn 2: just phụ thuộc production ──
FROM node:22-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev            # KHÔNG có devDependencies

# ── giai đoạn 3: ảnh chạy thật ──
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/dist        ./dist
COPY package.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]</code></pre>

<p>Only the final stage becomes the image. Stages 1 and 2 exist during the build and are discarded — <strong>the compiler never ships</strong>. The measured result, 77,5MB, is smaller than the single-stage slim build (79,6MB) because it copies <code>dist/</code> instead of <code>src/</code>.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">builder</span><span class="lz-d">the toolchain, devDependencies, the source. It can weigh 500MB — that is FINE, it gets thrown away</span></div>
  <div class="lz-layer"><span class="lz-t">deps</span><span class="lz-d">just <code>npm ci --omit=dev</code>. Kept separate so this layer caches independently of the build</span></div>
  <div class="lz-layer"><span class="lz-t">runner</span><span class="lz-d">the base image plus production node_modules plus dist. This is the ONLY thing that reaches the server</span></div>
</div>

<h3>Three lines that are not about size</h3>
<p>The runner stage has three lines whose value is not measured in megabytes:</p>

<div class="kv-grid">
  <div class="kv"><span>ENV NODE_ENV=production</span><b>Express enables view caching and disables stack traces; many libraries change behaviour on this variable. Forget it and you run dev mode in production</b></div>
  <div class="kv"><span>USER node</span><b>Containers run as ROOT by default. The node image already ships a <code>node</code> user — use it. An RCE while running as root is root ON THE HOST if the container can be escaped</b></div>
  <div class="kv"><span>npm ci, NOT npm install</span><b><code>ci</code> honours the lockfile absolutely and fails on any divergence; <code>install</code> can SILENTLY bump a version (chapter 4 measured it: 4.18.0 → 4.22.2)</b></div>
</div>

<div class="pitfall">
<p><strong>A real trap:</strong> the naive image copied <code>node_modules</code> from the host with <code>COPY . .</code>. On a Mac that means arm64 binaries going into a linux/amd64 image. Pure JS survives; anything native crashes with an architecture error that reads like a compiler bug. The fix is one line in <code>.dockerignore</code> — measured in the next lesson — and it also happens to make the build twice as fast.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> The backend Dockerfile is multi-stage on <code>node:22-slim</code>, and its comments record why. It installs <code>python3 make g++ pkg-config libvips-dev</code> in the builder stage only — because <code>sharp</code> downloads prebuilt binaries from GitHub at install time and that download timed out from this VPS four deploys in a row on 2026-07-06. Two fixes were applied together: the system libvips so sharp's compile-from-source fallback actually works, and <code>npm_config_sharp_binary_host</code> pointed at the npmmirror CDN so the install never touches GitHub. None of that toolchain reaches the runner stage. This is exactly the case where alpine would have been the wrong choice.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/docker${REF}"><span class="lc-t">Code Lab · Docker</span><span class="lc-d">Images, layers and multi-stage builds</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.1</span>
<h2>Ảnh Docker: từ 440MB xuống 58,8MB</h2>
<p class="lead">Một ảnh Docker không phải chi tiết đóng gói vặt vãnh. Nó được tải về ở mọi lần deploy, lưu trên mọi máy chủ, quét bởi mọi công cụ bảo mật, và cỡ của nó là khác biệt giữa một lần quay lui mất mười giây với một lần mất bốn phút trong lúc site đang chết. Bài này build cùng một ứng dụng theo bốn cách và đo xem mỗi lựa chọn tốn bao nhiêu.</p>

<h3>Bốn Dockerfile, một app</h3>
<p>Ứng dụng cố ý viết cho bình thường: Express 5, <code>pg</code>, <code>zod</code>, cộng TypeScript và vitest ở devDependencies. Cùng mã nguồn, bốn ảnh:</p>

<div class="out">ảnh nền (docker image inspect .Size):
  node:22              381,0 MB
  node:22-slim          76,2 MB
  node:22-alpine        55,4 MB

ảnh đã build:
  naive   (FROM node:22, COPY . ., npm install)    440,0 MB
  slim    (node:22-slim, npm ci --omit=dev)         79,6 MB
  alpine  (node:22-alpine, npm ci --omit=dev)       58,8 MB
  multi   (multi-stage trên node:22-slim)           77,5 MB</div>

<p><strong>440MB chọi 58,8MB — gấp 7,5 lần</strong> cho một ứng dụng mà mã của chính nó nặng bốn kilobyte. Gần như toàn bộ khác biệt là ảnh nền và những gì bạn chọn để lại bên trong nó.</p>

<div class="kv-grid">
  <div class="kv"><span>node:22</span><b>Debian đầy đủ + toolchain build + git + curl. 381MB trước khi bạn viết dòng nào</b></div>
  <div class="kv"><span>node:22-slim</span><b>Debian tối giản, KHÔNG toolchain. 76,2MB. Mặc định đúng cho phần lớn trường hợp</b></div>
  <div class="kv"><span>node:22-alpine</span><b>55,4MB. Nhỏ nhất, nhưng dùng musl libc chứ không phải glibc — module native có thể vỡ</b></div>
  <div class="kv"><span>distroless</span><b>Chỉ Node + app, KHÔNG có shell. An toàn nhất, và <code>docker exec ... sh</code> không dùng được nữa</b></div>
</div>

<div class="callout warn">
<p><strong>Cái bẫy alpine.</strong> Alpine dùng musl thay cho glibc. Gói thuần JavaScript thì chẳng sao; module native thì có — <code>sharp</code>, <code>bcrypt</code>, <code>canvas</code>, bất cứ thứ gì có một file nhị phân <code>.node</code>. Chúng hoặc cài không nổi, hoặc âm thầm rơi về một đường thuần JS chậm hơn, hoặc cài được rồi sập lúc chạy ở một nhánh code bạn chưa test. 20MB tiết kiệm được là có thật; buổi chiều bạn ngồi với <code>Error loading shared library ld-linux-x86-64.so.2</code> cũng có thật. Với một dự án dùng <code>sharp</code>, hãy chọn slim.</p>
</div>

<h3>Thật ra bên trong ảnh naive có gì</h3>
<p>Cái Dockerfile naive dài bốn dòng và cả bốn đều là sai lầm:</p>

<pre><code>FROM node:22           # ← 381MB, có cả gcc, make, python, git
WORKDIR /app
COPY . .               # ← copy CẢ node_modules của máy bạn (sai kiến trúc!)
RUN npm install        # ← cài luôn devDependencies: typescript, vitest
CMD ["npm", "start"]   # ← bài 17.3 sẽ chứng minh dòng này làm mất request</code></pre>

<p>59MB mà nó thêm lên trên ảnh nền là <code>node_modules</code> có typescript và vitest bên trong — một trình biên dịch và một bộ chạy test, được chở lên production, nơi sẽ không bao giờ có gì chạy chúng. Chúng không chỉ là trọng lượng chết: mọi gói trong ảnh đều là một thứ mà máy quét lỗ hổng sẽ báo và kẻ tấn công chuỗi cung ứng có thể dùng (chương 4).</p>

<h3>Multi-stage: build ở một chỗ rồi vứt chỗ đó đi</h3>
<p>Mâu thuẫn là có thật — bạn <em>cần</em> devDependencies để build và <em>không muốn</em> chúng có trong kết quả. Multi-stage giải quyết bằng cách build trong một ảnh rồi chỉ chép phần đầu ra sang ảnh khác:</p>

<pre><code># ── giai đoạn 1: build (có devDependencies, có toolchain) ──
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci                       # ĐẦY ĐỦ, gồm cả devDependencies
COPY . .
RUN npm run build                # tsc, bundler, gì cũng được

# ── giai đoạn 2: chỉ phụ thuộc production ──
FROM node:22-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev            # KHÔNG có devDependencies

# ── giai đoạn 3: ảnh chạy thật ──
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/dist        ./dist
COPY package.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]</code></pre>

<p>Chỉ giai đoạn cuối trở thành cái ảnh. Giai đoạn 1 và 2 tồn tại trong lúc build rồi bị vứt — <strong>trình biên dịch không bao giờ lên máy chủ</strong>. Kết quả đo được, 77,5MB, còn nhỏ hơn bản slim một-giai-đoạn (79,6MB) vì nó chép <code>dist/</code> thay vì <code>src/</code>.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">builder</span><span class="lz-d">toolchain, devDependencies, mã nguồn. Có thể nặng 500MB — KHÔNG SAO, nó bị vứt</span></div>
  <div class="lz-layer"><span class="lz-t">deps</span><span class="lz-d">chỉ <code>npm ci --omit=dev</code>. Tách riêng để tầng này được cache độc lập với việc build</span></div>
  <div class="lz-layer"><span class="lz-t">runner</span><span class="lz-d">ảnh nền + node_modules production + dist. Đây là thứ DUY NHẤT lên tới máy chủ</span></div>
</div>

<h3>Ba dòng không liên quan tới cỡ ảnh</h3>
<p>Giai đoạn runner có ba dòng mà giá trị của chúng không đo bằng megabyte:</p>

<div class="kv-grid">
  <div class="kv"><span>ENV NODE_ENV=production</span><b>Express bật cache view + tắt stack trace; nhiều thư viện đổi hành vi theo biến này. Quên nó là đang chạy chế độ dev ở production</b></div>
  <div class="kv"><span>USER node</span><b>Mặc định container chạy bằng ROOT. Ảnh node có sẵn user <code>node</code> — hãy dùng nó. Một lỗ RCE khi đang là root là root TRÊN CẢ HOST nếu thoát được container</b></div>
  <div class="kv"><span>npm ci, KHÔNG npm install</span><b><code>ci</code> tôn trọng lockfile tuyệt đối và fail nếu lệch; <code>install</code> có thể ÂM THẦM nâng phiên bản (chương 4 đã đo: 4.18.0 → 4.22.2)</b></div>
</div>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> ảnh naive đã chép <code>node_modules</code> từ máy bạn vào bằng <code>COPY . .</code>. Trên máy Mac điều đó nghĩa là file nhị phân arm64 chui vào một ảnh linux/amd64. JavaScript thuần thì sống sót; thứ gì native thì sập với một lỗi kiến trúc đọc như lỗi trình biên dịch. Phép sửa là một dòng trong <code>.dockerignore</code> — đo ở bài sau — và nó tiện thể làm build nhanh gấp đôi.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Dockerfile của backend là multi-stage trên <code>node:22-slim</code>, và các dòng chú thích trong đó ghi lại lý do. Nó cài <code>python3 make g++ pkg-config libvips-dev</code> chỉ ở giai đoạn builder — vì <code>sharp</code> tải file nhị phân dựng sẵn từ GitHub lúc cài đặt và lần tải ấy hết giờ từ chính cái VPS này, bốn lần deploy liên tiếp ngày 06/07/2026. Hai phép sửa được áp cùng lúc: cài libvips của hệ thống để đường biên dịch-từ-nguồn dự phòng của sharp thật sự chạy được, và trỏ <code>npm_config_sharp_binary_host</code> sang CDN npmmirror để lúc cài không đụng tới GitHub nữa. Không mẩu toolchain nào trong số đó tới được giai đoạn runner. Đây chính xác là trường hợp mà chọn alpine sẽ là sai.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/docker${REF}"><span class="lc-t">Code Lab · Docker</span><span class="lc-d">Ảnh, tầng và build nhiều giai đoạn</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 17.2 ─────────────────────────── */
    {
      title: '17.2 — Layer cache: the line order that makes builds 5,6× slower|||17.2 — Cache tầng: thứ tự dòng làm build chậm gấp 5,6 lần',
      slug: 'nodejs-17-2-cache-tang',
      simulations: [
        {
          url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-2-cache-tang--docker-layers.mp4',
          poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-2-cache-tang--docker-layers.jpg',
          durationSeconds: 30,
          scenario: 'docker-layers',
          caption: { en: 'The line order that invalidates every layer below it', vi: 'Thứ tự dòng làm hỏng mọi tầng bên dưới' },
        },
        {
          url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-2-cache-tang--vps-memory.mp4',
          poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-2-cache-tang--vps-memory.jpg',
          durationSeconds: 24,
          scenario: 'vps-memory',
          caption: { en: 'Two parallel builds, 6GB of RAM, and exit 137', vi: 'Hai build song song, 6GB RAM, và exit 137' },
        },
      ],
      type: 'VIDEO',
      description: 'Đổi chỗ hai dòng trong Dockerfile và đo lại thời gian build sau khi sửa một dòng code, cộng phép đo .dockerignore cắt build context từ 64,27MB xuống 235 byte.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.2</span>
<h2>Layer cache: the line order that makes builds 5,6× slower</h2>
<p class="lead">Docker caches each instruction as a layer and reuses it when nothing that instruction depends on has changed. That mechanism is simple, and the consequence is not: <strong>the order of lines in a Dockerfile determines how long every future build takes.</strong> One swap, measured below, is the difference between a 0,54-second rebuild and a 3-second one — and on a real project with a real <code>npm ci</code>, between seconds and minutes.</p>

<h3>The rule, in one sentence</h3>
<p>When an instruction's inputs change, that layer and <em>every layer after it</em> is rebuilt. So put the things that rarely change at the top and the things that change on every commit at the bottom.</p>

<p>Your source code changes on every commit. Your <code>package.json</code> changes once a month. Therefore:</p>

<pre><code># ✗ SAI — mọi lần sửa code đều chạy lại npm ci
COPY . .
RUN npm ci --omit=dev

# ✓ ĐÚNG — npm ci just chạy lại khi package.json/package-lock.json đổi
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src</code></pre>

<p>Measured: change one line in <code>src/index.js</code>, rebuild each variant with a warm cache:</p>

<div class="out">COPY . . rồi npm ci        rebuild  3,00s
COPY package.json TRƯỚC    rebuild  0,54s      (nhanh gấp 5,6 lần)
multi-stage                rebuild  1,13s      (3 giai đoạn, vẫn bỏ qua npm ci)</div>

<p>The 5,6× here is on a three-package project where <code>npm ci</code> takes about two seconds. On the real backend behind this course — with native modules, a libvips compile fallback and a sharp binary download — that same reinstall is minutes, on every deploy, forever, purely because of line order.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">FROM plus system packages</span><span class="lz-d">apt-get. Changes every few months</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">COPY package*.json</span><span class="lz-d">ONLY these two files; nothing else copied yet</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">RUN npm ci</span><span class="lz-d">The most expensive layer. Cached until the lockfile changes</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">COPY the source</span><span class="lz-d">Changes on every commit — so it must come AFTER the expensive layer</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">RUN build</span><span class="lz-d">Re-runs on every code change, but that is work you genuinely have to do</span></div>
</div>

<div class="pitfall">
<p><strong>A real trap:</strong> <code>COPY package*.json ./</code> matches <code>package.json</code> and <code>package-lock.json</code> — and silently matches nothing at all if you are in the wrong directory, because <code>COPY</code> with a glob that matches zero files does not error. The build then fails several lines later at <code>npm ci</code> with a confusing "no such file" and everyone blames npm.</p>
</div>

<h3><code>.dockerignore</code>: the file everyone forgets</h3>
<p>Before Docker runs a single instruction, it uploads the build context — the directory you pointed at — to the build engine. With <code>COPY . .</code> in the Dockerfile, whatever is in that directory ends up in the image too. Measured with and without a four-line <code>.dockerignore</code>:</p>

<div class="out">KHÔNG có .dockerignore:  transferring context: 64.27MB 0.9s   build 6,33s   ảnh 97,2 MB
CÓ .dockerignore:        transferring context:   235B 0.0s   build 3,06s   ảnh 79,6 MB</div>

<p><strong>64,27MB down to 235 bytes.</strong> The build got 2,1× faster and the image lost 17,6MB — and that 17,6MB was the host's <code>node_modules</code>, compiled for the wrong architecture, sitting inside the image ready to shadow the correct one installed by <code>npm ci</code>.</p>

<pre><code># .dockerignore — bốn dòng, không có lý do gì để không có
node_modules
.git
.env
dist</code></pre>

<div class="kv-grid">
  <div class="kv"><span>node_modules</span><b>Wrong architecture, large, and <code>npm ci</code> reinstalls it all anyway. The most important line</b></div>
  <div class="kv"><span>.git</span><b>The entire repo history, including the secrets you deleted in a later commit</b></div>
  <div class="kv"><span>.env</span><b>Copying secrets into the image is the surest way to distribute them</b></div>
  <div class="kv"><span>dist</span><b>It gets rebuilt inside the image. Your machine's copy only causes confusion</b></div>
</div>

<div class="callout">
<p><strong>Why the context shrank so much.</strong> BuildKit only sends what the Dockerfile actually references — with <code>COPY package*.json</code> plus <code>COPY src</code>, the context was tiny even without <code>.dockerignore</code>. The 64,27MB appeared only with <code>COPY . .</code>. That is a useful thing to know and a bad thing to rely on: selective <code>COPY</code> and <code>.dockerignore</code> protect against different mistakes, and the second one keeps working after somebody adds a <code>COPY . .</code> in six months.</p>
</div>

<h3>Cache invalidation you did not intend</h3>
<p>Three common ways a build that should be cached is not:</p>

<div class="kv-grid">
  <div class="kv"><span>An empty CI cache</span><b>A fresh runner every run means a cold cache every run. You need <code>--cache-from</code> pointed at a registry, otherwise "optimising layer order" does nothing whatsoever in CI</b></div>
  <div class="kv"><span>An ARG placed too high</span><b>One <code>ARG BUILD_TIME</code> that changes on every build invalidates EVERY layer beneath it. Put an ARG as close to its use as you can</b></div>
  <div class="kv"><span>COPY . . before installing</span><b>Exactly the mistake at the top of this lesson. Any change to any file re-runs the install</b></div>
</div>

<h3>Building for a machine that is not yours</h3>
<p>An image built on an Apple Silicon Mac is <code>linux/arm64</code>. A typical VPS is <code>linux/amd64</code>. Docker will happily run the wrong one through emulation and it will be several times slower, or simply refuse:</p>

<pre><code># build đúng kiến trúc của máy đích
docker build --platform linux/amd64 -t app:1.4.2 .

# hoặc build cho cả hai, đẩy thẳng lên registry
docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/me/app:1.4.2 --push .</code></pre>

<div class="callout warn">
<p><strong>The other option: do not build on your laptop at all.</strong> Building on the target machine removes the architecture question entirely, and removes the upload of a 400MB image over a home connection. It costs the VPS's CPU and RAM during the build — which is a real constraint on a small box, and is why the deploy script discussed below builds its two images <em>sequentially</em> rather than in parallel.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Images are built <em>on the VPS</em>, one at a time. The comment in <code>deploy.sh</code> explains why: parallel cold builds of the backend and frontend once had the kernel OOM-kill <code>next build</code> with exit 137 on the 6GB box (2026-07-06). The build cache is pruned after every deploy to keep the disk from filling — the incident from chapter 15 — which means every deploy is a cold build, which in turn is exactly why the layer ordering in this lesson matters here more than it would with a warm cache. The two constraints interact: prune the cache to save disk, and layer order becomes the only thing keeping deploys short.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/docker${REF}"><span class="lc-t">Code Lab · Docker</span><span class="lc-d">Build cache, .dockerignore and multi-platform builds</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/github-actions${REF}#module-924"><span class="lc-t">Code Lab · Building &amp; Testing in CI</span><span class="lc-d">Caching Docker layers between CI runs</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.2</span>
<h2>Cache tầng: thứ tự dòng làm build chậm gấp 5,6 lần</h2>
<p class="lead">Docker cache mỗi lệnh thành một tầng và dùng lại khi không có gì mà lệnh đó phụ thuộc vào bị đổi. Cơ chế thì đơn giản, hệ quả thì không: <strong>thứ tự các dòng trong Dockerfile quyết định mọi lần build về sau mất bao lâu.</strong> Một phép đổi chỗ, đo ngay dưới đây, là khác biệt giữa build lại 0,54 giây với 3 giây — và trên một dự án thật với một lệnh <code>npm ci</code> thật, là khác biệt giữa vài giây với vài phút.</p>

<h3>Quy tắc, gói trong một câu</h3>
<p>Khi đầu vào của một lệnh thay đổi, tầng đó và <em>mọi tầng phía sau nó</em> đều bị build lại. Vậy nên hãy đặt những thứ hiếm khi đổi lên trên và những thứ đổi ở mọi commit xuống dưới.</p>

<p>Mã nguồn của bạn đổi ở mọi commit. <code>package.json</code> của bạn đổi mỗi tháng một lần. Do đó:</p>

<pre><code># ✗ SAI — mọi lần sửa code đều chạy lại npm ci
COPY . .
RUN npm ci --omit=dev

# ✓ ĐÚNG — npm ci chỉ chạy lại khi package.json/package-lock.json đổi
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src</code></pre>

<p>Đo thật: sửa một dòng trong <code>src/index.js</code>, build lại từng biến thể với cache ấm:</p>

<div class="out">COPY . . rồi npm ci        rebuild  3,00s
COPY package.json TRƯỚC    rebuild  0,54s      (nhanh gấp 5,6 lần)
multi-stage                rebuild  1,13s      (3 giai đoạn, vẫn bỏ qua npm ci)</div>

<p>Con số 5,6 lần ở đây là trên một dự án ba gói mà <code>npm ci</code> mất khoảng hai giây. Trên chính cái backend đứng sau khoá học này — với module native, một đường biên dịch libvips dự phòng và một lượt tải nhị phân sharp — cùng phép cài lại ấy tính bằng phút, ở mọi lần deploy, mãi mãi, thuần tuý vì thứ tự dòng.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">FROM + cài gói hệ thống</span><span class="lz-d">apt-get. Đổi vài tháng một lần</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">COPY package*.json</span><span class="lz-d">CHỈ hai file này, chưa copy gì khác</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">RUN npm ci</span><span class="lz-d">Tầng đắt nhất. Được cache cho tới khi lockfile đổi</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">COPY mã nguồn</span><span class="lz-d">Đổi ở mọi commit — nên phải nằm SAU tầng đắt</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">RUN build</span><span class="lz-d">Chạy lại mỗi lần sửa code, nhưng đó là việc bắt buộc phải làm</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> <code>COPY package*.json ./</code> khớp <code>package.json</code> và <code>package-lock.json</code> — và âm thầm khớp <em>không file nào</em> nếu bạn đang ở sai thư mục, vì <code>COPY</code> với một mẫu khớp rỗng thì <em>không</em> báo lỗi. Build sau đó hỏng ở vài dòng dưới tại <code>npm ci</code> với một thông điệp "no such file" khó hiểu và mọi người đổ tội cho npm.</p>
</div>

<h3><code>.dockerignore</code>: cái file ai cũng quên</h3>
<p>Trước khi Docker chạy một lệnh nào, nó tải build context — cái thư mục bạn trỏ tới — lên cỗ máy build. Với <code>COPY . .</code> trong Dockerfile thì mọi thứ trong thư mục ấy cũng chui luôn vào ảnh. Đo với và không có một file <code>.dockerignore</code> bốn dòng:</p>

<div class="out">KHÔNG có .dockerignore:  transferring context: 64.27MB 0.9s   build 6,33s   ảnh 97,2 MB
CÓ .dockerignore:        transferring context:   235B 0.0s   build 3,06s   ảnh 79,6 MB</div>

<p><strong>64,27MB xuống 235 byte.</strong> Build nhanh hơn 2,1 lần và ảnh nhẹ đi 17,6MB — mà 17,6MB đó chính là <code>node_modules</code> của máy bạn, biên dịch cho sai kiến trúc, nằm sẵn trong ảnh chờ che mất bản đúng do <code>npm ci</code> cài.</p>

<pre><code># .dockerignore — bốn dòng, không có lý do gì để không có
node_modules
.git
.env
dist</code></pre>

<div class="kv-grid">
  <div class="kv"><span>node_modules</span><b>Sai kiến trúc, to, và <code>npm ci</code> đằng nào cũng cài lại. Dòng quan trọng nhất</b></div>
  <div class="kv"><span>.git</span><b>Toàn bộ lịch sử repo, gồm cả những bí mật bạn đã xoá ở commit sau</b></div>
  <div class="kv"><span>.env</span><b>Chép bí mật vào ảnh là cách chắc chắn nhất để chúng bị phát tán</b></div>
  <div class="kv"><span>dist</span><b>Sẽ được build lại trong ảnh. Bản của máy bạn chỉ gây nhầm lẫn</b></div>
</div>

<div class="callout">
<p><strong>Vì sao context lại teo đi nhiều thế.</strong> BuildKit chỉ gửi những gì Dockerfile thật sự tham chiếu tới — với <code>COPY package*.json</code> cộng <code>COPY src</code> thì context vốn đã bé tí ngay cả khi không có <code>.dockerignore</code>. Con số 64,27MB chỉ xuất hiện với <code>COPY . .</code>. Đó là điều hay để biết và là điều dở để dựa vào: <code>COPY</code> có chọn lọc và <code>.dockerignore</code> bảo vệ bạn khỏi hai loại sai lầm khác nhau, và cái thứ hai vẫn còn tác dụng sau khi ai đó thêm một dòng <code>COPY . .</code> vào sáu tháng nữa.</p>
</div>

<h3>Những lần cache bị vô hiệu ngoài ý muốn</h3>
<p>Ba cách phổ biến khiến một lần build lẽ ra được cache lại không được:</p>

<div class="kv-grid">
  <div class="kv"><span>Cache CI trống rỗng</span><b>Runner mới mỗi lần chạy = cache nguội mỗi lần. Cần <code>--cache-from</code> trỏ vào registry, nếu không "tối ưu thứ tự tầng" chẳng có tác dụng gì trên CI</b></div>
  <div class="kv"><span>ARG đặt trên cao</span><b>Một <code>ARG BUILD_TIME</code> đổi ở mọi build sẽ vô hiệu hoá MỌI tầng bên dưới nó. Đặt ARG càng sát chỗ dùng càng tốt</b></div>
  <div class="kv"><span>COPY . . trước khi cài</span><b>Chính là lỗi ở đầu bài. Mọi thay đổi ở bất kỳ file nào cũng làm chạy lại phần cài đặt</b></div>
</div>

<h3>Build cho một cái máy không phải máy của bạn</h3>
<p>Ảnh build trên Mac chip Apple là <code>linux/arm64</code>. Một VPS điển hình là <code>linux/amd64</code>. Docker sẽ vui vẻ chạy cái sai qua giả lập và nó chậm gấp nhiều lần, hoặc đơn giản là từ chối:</p>

<pre><code># build đúng kiến trúc của máy đích
docker build --platform linux/amd64 -t app:1.4.2 .

# hoặc build cho cả hai, đẩy thẳng lên registry
docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/me/app:1.4.2 --push .</code></pre>

<div class="callout warn">
<p><strong>Lựa chọn còn lại: đừng build trên laptop nữa.</strong> Build ngay trên máy đích xoá sạch câu hỏi kiến trúc, và xoá luôn việc tải lên một cái ảnh 400MB qua đường mạng ở nhà. Cái giá là CPU và RAM của VPS trong lúc build — vốn là ràng buộc có thật trên một cái máy nhỏ, và là lý do cái script deploy bàn ở dưới build hai cái ảnh của nó <em>tuần tự</em> chứ không song song.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Ảnh được build <em>trên VPS</em>, mỗi lần một cái. Dòng chú thích trong <code>deploy.sh</code> giải thích vì sao: có lần build nguội song song backend và frontend đã bị nhân hệ điều hành giết <code>next build</code> vì hết bộ nhớ, exit 137, trên cái máy 6GB (06/07/2026). Cache build bị dọn sau mỗi lần deploy để đĩa khỏi đầy — chính sự cố ở chương 15 — nghĩa là mọi lần deploy đều là build nguội, mà điều đó lại đúng là lý do thứ tự tầng trong bài này quan trọng ở đây hơn hẳn so với khi có cache ấm. Hai ràng buộc ấy tương tác với nhau: dọn cache để cứu đĩa, và thứ tự tầng trở thành thứ duy nhất giữ cho thời gian deploy còn ngắn.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/docker${REF}"><span class="lc-t">Code Lab · Docker</span><span class="lc-d">Cache build, .dockerignore và build đa nền tảng</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/github-actions${REF}#module-924"><span class="lc-t">Code Lab · Building &amp; Testing in CI</span><span class="lc-d">Cache tầng Docker giữa các lần chạy CI</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 17.3 ─────────────────────────── */
    {
      title: '17.3 — PID 1: the CMD line that loses every in-flight request|||17.3 — PID 1: dòng CMD làm mất mọi request đang xử lý',
      slug: 'nodejs-17-3-pid-1-tat-em',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-3-pid-1-tat-em.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-3-pid-1-tat-em.jpg',
        scenario: 'docker-compose',
        durationSeconds: 23,
        caption: { en: "“Running” is not “ready”: depends_on versus healthcheck", vi: "“Đang chạy” không phải “sẵn sàng”: depends_on so với healthcheck" },
      },
      type: 'VIDEO',
      description: 'Ba cách viết CMD, ba tiến trình PID 1 khác nhau, và chỉ một trong ba nhận được SIGTERM — chứng minh bằng một request 3 giây bị cắt ngang giữa lúc deploy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.3</span>
<h2>PID 1: the CMD line that loses every in-flight request</h2>
<p class="lead">Chapter 13 built a graceful shutdown: catch <code>SIGTERM</code>, stop accepting connections, let in-flight requests finish, exit. It works perfectly — and inside a container it may never run, because of how you wrote one line of the Dockerfile. This lesson measures three ways of writing <code>CMD</code> and shows that two of them silently discard the shutdown handler you carefully wrote.</p>

<h3>Who is PID 1?</h3>
<p>When Docker stops a container it sends <code>SIGTERM</code> to process 1 inside it. Whatever you put in <code>CMD</code> becomes process 1 — and that is not always what you think:</p>

<div class="out">CMD ["npm", "start"]           → PID 1 = npm start
CMD node src/index.js          → PID 1 = sh          (dạng shell!)
CMD ["node", "src/index.js"]   → PID 1 = node        (dạng exec)</div>

<p>Only the third one puts your application at PID 1. Now stop each container and read what the application logged. The app prints <code>NHAN-SIGTERM</code> when the signal arrives and <code>DA-DONG</code> when shutdown completes:</p>

<div class="out">naive  PID1=npm start   dừng mất 0,7s   log: SAN-SANG 19 | npm error signal SIGTERM
shell  PID1=sh          dừng mất 1,2s   log: SAN-SANG 8
slim   PID1=node        dừng mất 0,2s   log: SAN-SANG 1 | NHAN-SIGTERM | DA-DONG</div>

<div class="danger">
<p><strong>Two of the three never printed <code>NHAN-SIGTERM</code>.</strong> With <code>npm start</code>, npm received the signal, died, and reported <code>npm error signal SIGTERM</code> — its Node child was killed without ever being asked to shut down. With the shell form, <code>sh</code> received the signal and does not forward signals to its children, so the application heard nothing at all: its log ends at <code>SAN-SANG 8</code>. The graceful shutdown handler exists in the source, is correct, and has never once executed in production.</p>
</div>

<h3>What that costs, measured</h3>
<p>Add a route that takes three seconds — a report, an upload, a payment call. Start it, and one second in, deploy:</p>

<div class="out">ảnh naive (CMD ["npm","start"]):
  client nhận:  KHÔNG GÌ CẢ (kết nối bị cắt)
  log:          SAN-SANG 19 | npm error signal SIGTERM

ảnh slim (CMD ["node",...]) với docker stop -t 5:
  client nhận:  {"done":true}  HTTP=200  sau 3,03s
  log:          SAN-SANG 1 | NHAN-SIGTERM | DA-DONG
  container:    exit code 0</div>

<p>The same deploy, the same instant, the same user: one gets their answer, the other gets a dropped connection. Multiply by however many requests are in flight when you deploy — on a busy service that is dozens per deploy, several times a day, forever.</p>

<h3>The second half: the grace period</h3>
<p>Getting the signal is necessary and not sufficient. Docker waits a fixed time after <code>SIGTERM</code> and then sends <code>SIGKILL</code>, which cannot be caught. Measured on Docker 29.5.3, same container, same 3-second request, three repetitions each:</p>

<div class="out">docker stop         (mặc định)  giết sau 1,26s   exit 137   client MẤT TRẮNG   (3/3 lần)
docker stop -t 0                giết sau 0,26s   exit 137   client MẤT TRẮNG
docker stop -t 5                thoát sau 2,21s  exit   0   client nhận 200
docker stop -t 10               thoát sau 2,22s  exit   0   client nhận 200</div>

<div class="danger">
<p><strong>The default was not enough.</strong> On this Docker version the bare <code>docker stop</code> killed the container after about 1,26 seconds — reproducibly, three times out of three — while the request needed three. The application did everything right: it caught the signal, called <code>server.close()</code>, and was working through the request when it was killed. <strong>Exit code 137 is 128 + 9: SIGKILL.</strong> If you see 137 in your deploy logs, this is one of the two things it means (the other is an out-of-memory kill, chapter 16).</p>
</div>

<p>The commonly quoted default is ten seconds. This measurement says otherwise on Docker 29.5.3, which is exactly the reason to <strong>set it explicitly rather than inherit it</strong>:</p>

<pre><code># docker-compose.yml
services:
  backend:
    stop_grace_period: 30s        # ĐẶT RÕ. Đừng thừa kế một mặc định bạn chưa đo</code></pre>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Docker sends SIGTERM to PID 1</span><span class="lz-d">That must be your Node process — use the exec form of CMD</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">The app stops accepting NEW connections</span><span class="lz-d"><code>server.close()</code>. The load balancer should already have pulled it out beforehand</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">IN-FLIGHT requests are allowed to finish</span><span class="lz-d">This is the entire reason the mechanism exists</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Close the DB pool, close the queue workers</span><span class="lz-d">A half-finished job must be returned to the queue (chapter 13)</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">process.exit(0)</span><span class="lz-d">Before the grace period expires, otherwise it is SIGKILL and exit 137</span></div>
</div>

<h3>When you genuinely need <code>npm start</code></h3>
<p>Sometimes the entrypoint must run a script — migrations before boot, for instance. Two correct ways:</p>

<pre><code># cách 1: exec — thay thế shell bằng node, giữ nguyên PID 1
#!/bin/sh
npx prisma migrate deploy
exec node dist/index.js        # ← 'exec' là từ khoá quan trọng nhất ở đây

# cách 2: dùng init để nhận và chuyển tiếp tín hiệu
# docker run --init ...        (Docker nhét sẵn tini vào PID 1)</code></pre>

<p><code>exec</code> replaces the shell process with node instead of forking a child, so node <em>becomes</em> PID 1 and receives signals directly. Without it, the shell stays at PID 1 and you are back to the middle row of the table.</p>

<div class="pitfall">
<p><strong>A real trap:</strong> a Node process at PID 1 is also responsible for reaping zombie children — a job normally done by init. If your app spawns child processes (ffmpeg, imagemagick, yt-dlp), their finished processes accumulate as zombies and eventually exhaust the process table. That is what <code>--init</code> exists for. If you never spawn anything, PID 1 as node is fine.</p>
</div>

<h3>Health checks that the orchestrator can act on</h3>
<pre><code>HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \\
  CMD node -e "fetch('http://127.0.0.1:3000/health/live').then(r=&gt;process.exit(r.ok?0:1)).catch(()=&gt;process.exit(1))"</code></pre>

<p><code>--start-period</code> is the parameter people omit and then get paged about: during it, failures do not count towards <code>--retries</code>. Without it, a service that takes 15 seconds to boot is marked unhealthy and restarted, and restarts forever. And per chapter 15: the health check URL must be the <em>liveness</em> probe, not one that touches the database — otherwise a database blip restarts every container at once.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> The graceful shutdown here is real and measured: chapter 13 recorded the log sequence <code>SAN-SANG | BATDAU 1 | NHAN-SIGTERM | XONG 1 | DA-DONG</code> with the process exiting after 1296ms, against 5ms and one stuck active job when SIGTERM was not handled. The deploy path uses <code>docker compose up -d --force-recreate</code>, whose comment in <code>deploy.sh</code> notes it swaps containers atomically rather than <code>down &amp;&amp; up</code> — the right instinct. The gap this lesson identifies is that no <code>stop_grace_period</code> is set anywhere, so the swap inherits whatever default the installed Docker has, which the table above shows can be about one second. For an API where the slowest routes are AI calls measured in <em>hundreds</em> of seconds, that is worth pinning down explicitly.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/docker${REF}"><span class="lc-t">Code Lab · Docker</span><span class="lc-d">Entrypoints, signals and container lifecycle</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-989"><span class="lc-t">Code Lab · Health Checks &amp; Uptime</span><span class="lc-d">Probes that an orchestrator can act on</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.3</span>
<h2>PID 1: dòng CMD làm mất mọi request đang xử lý</h2>
<p class="lead">Chương 13 đã dựng phần tắt êm: bắt <code>SIGTERM</code>, ngừng nhận kết nối, để request đang chạy hoàn thành, rồi thoát. Nó chạy hoàn hảo — và bên trong container nó có thể <em>không bao giờ chạy</em>, chỉ vì cách bạn viết một dòng trong Dockerfile. Bài này đo ba cách viết <code>CMD</code> và cho thấy hai trong ba cách âm thầm vứt bỏ cái handler tắt êm mà bạn đã kỳ công viết ra.</p>

<h3>Ai là PID 1?</h3>
<p>Khi Docker dừng một container, nó gửi <code>SIGTERM</code> tới tiến trình số 1 bên trong. Bất cứ thứ gì bạn đặt ở <code>CMD</code> đều trở thành tiến trình số 1 — và đó không phải lúc nào cũng là thứ bạn nghĩ:</p>

<div class="out">CMD ["npm", "start"]           → PID 1 = npm start
CMD node src/index.js          → PID 1 = sh          (dạng shell!)
CMD ["node", "src/index.js"]   → PID 1 = node        (dạng exec)</div>

<p>Chỉ cách thứ ba đặt ứng dụng của bạn ở PID 1. Giờ dừng từng container và đọc xem ứng dụng đã log gì. App in <code>NHAN-SIGTERM</code> khi tín hiệu tới và <code>DA-DONG</code> khi tắt xong:</p>

<div class="out">naive  PID1=npm start   dừng mất 0,7s   log: SAN-SANG 19 | npm error signal SIGTERM
shell  PID1=sh          dừng mất 1,2s   log: SAN-SANG 8
slim   PID1=node        dừng mất 0,2s   log: SAN-SANG 1 | NHAN-SIGTERM | DA-DONG</div>

<div class="danger">
<p><strong>Hai trong ba cách chưa từng in ra <code>NHAN-SIGTERM</code>.</strong> Với <code>npm start</code>, npm nhận tín hiệu, chết, và báo <code>npm error signal SIGTERM</code> — tiến trình Node con của nó bị giết mà chưa từng được hỏi ý kiến. Với dạng shell, <code>sh</code> nhận tín hiệu và <em>không</em> chuyển tiếp tín hiệu cho con, nên ứng dụng chẳng nghe thấy gì: log của nó dừng ở <code>SAN-SANG 8</code>. Cái handler tắt êm ấy tồn tại trong mã nguồn, hoàn toàn đúng, và chưa một lần nào được thực thi ở production.</p>
</div>

<h3>Cái đó tốn gì, đo thật</h3>
<p>Thêm một route mất ba giây — một báo cáo, một lượt upload, một lời gọi thanh toán. Cho nó chạy, và một giây sau thì deploy:</p>

<div class="out">ảnh naive (CMD ["npm","start"]):
  client nhận:  KHÔNG GÌ CẢ (kết nối bị cắt)
  log:          SAN-SANG 19 | npm error signal SIGTERM

ảnh slim (CMD ["node",...]) với docker stop -t 5:
  client nhận:  {"done":true}  HTTP=200  sau 3,03s
  log:          SAN-SANG 1 | NHAN-SIGTERM | DA-DONG
  container:    exit code 0</div>

<p>Cùng một lần deploy, cùng một khoảnh khắc, cùng một người dùng: một người nhận được câu trả lời, người kia nhận được một kết nối đứt. Nhân lên với số request đang chạy dở vào lúc bạn deploy — trên một dịch vụ đông, đó là vài chục cái mỗi lần deploy, vài lần mỗi ngày, mãi mãi.</p>

<h3>Nửa còn lại: khoảng ân hạn</h3>
<p>Nhận được tín hiệu là điều kiện cần chứ chưa đủ. Docker chờ một khoảng cố định sau <code>SIGTERM</code> rồi gửi <code>SIGKILL</code>, thứ không bắt được. Đo trên Docker 29.5.3, cùng container, cùng request 3 giây, mỗi cấu hình lặp ba lần:</p>

<div class="out">docker stop         (mặc định)  giết sau 1,26s   exit 137   client MẤT TRẮNG   (3/3 lần)
docker stop -t 0                giết sau 0,26s   exit 137   client MẤT TRẮNG
docker stop -t 5                thoát sau 2,21s  exit   0   client nhận 200
docker stop -t 10               thoát sau 2,22s  exit   0   client nhận 200</div>

<div class="danger">
<p><strong>Mặc định là KHÔNG ĐỦ.</strong> Trên phiên bản Docker này, lệnh <code>docker stop</code> trần giết container sau khoảng 1,26 giây — lặp lại được, ba lần trên ba — trong khi request cần ba giây. Ứng dụng đã làm đúng mọi thứ: nó bắt tín hiệu, gọi <code>server.close()</code>, và đang xử lý nốt request thì bị giết. <strong>Mã thoát 137 là 128 + 9: SIGKILL.</strong> Nếu bạn thấy 137 trong log deploy thì đây là một trong hai nghĩa của nó (nghĩa còn lại là bị giết vì hết bộ nhớ, chương 16).</p>
</div>

<p>Con số mặc định người ta hay trích là mười giây. Phép đo này nói khác trên Docker 29.5.3, và đó chính xác là lý do phải <strong>đặt nó tường minh chứ đừng thừa kế</strong>:</p>

<pre><code># docker-compose.yml
services:
  backend:
    stop_grace_period: 30s        # ĐẶT RÕ. Đừng thừa kế một mặc định bạn chưa đo</code></pre>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Docker gửi SIGTERM tới PID 1</span><span class="lz-d">Phải là tiến trình Node của bạn — dùng CMD dạng exec</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">App ngừng nhận kết nối MỚI</span><span class="lz-d"><code>server.close()</code>. Cân bằng tải lẽ ra đã rút nó ra từ trước rồi</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Request ĐANG chạy được hoàn thành</span><span class="lz-d">Đây là toàn bộ lý do tồn tại của cơ chế này</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Đóng pool DB, đóng worker hàng đợi</span><span class="lz-d">Job đang chạy dở phải được trả về hàng đợi (chương 13)</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">process.exit(0)</span><span class="lz-d">Trước khi hết khoảng ân hạn, nếu không thì SIGKILL và exit 137</span></div>
</div>

<h3>Khi bạn thật sự cần <code>npm start</code></h3>
<p>Đôi khi entrypoint phải chạy một script — ví dụ chạy migration trước khi khởi động. Có hai cách đúng:</p>

<pre><code># cách 1: exec — thay thế shell bằng node, giữ nguyên PID 1
#!/bin/sh
npx prisma migrate deploy
exec node dist/index.js        # ← 'exec' là từ khoá quan trọng nhất ở đây

# cách 2: dùng init để nhận và chuyển tiếp tín hiệu
# docker run --init ...        (Docker nhét sẵn tini vào PID 1)</code></pre>

<p><code>exec</code> <em>thay thế</em> tiến trình shell bằng node chứ không rẽ ra một tiến trình con, nên node <em>trở thành</em> PID 1 và nhận tín hiệu trực tiếp. Không có nó thì shell vẫn ngồi ở PID 1 và bạn quay lại đúng dòng giữa của cái bảng.</p>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> một tiến trình Node ở PID 1 còn phải chịu trách nhiệm thu dọn tiến trình con thây ma (zombie) — việc mà init thường làm. Nếu app của bạn có sinh ra tiến trình con (ffmpeg, imagemagick, yt-dlp) thì những tiến trình đã kết thúc của chúng sẽ tích lại thành thây ma và cuối cùng làm cạn bảng tiến trình. Đó là lý do <code>--init</code> tồn tại. Nếu bạn không sinh ra thứ gì thì để node làm PID 1 là ổn.</p>
</div>

<h3>Health check mà bộ điều phối hành động được</h3>
<pre><code>HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \\
  CMD node -e "fetch('http://127.0.0.1:3000/health/live').then(r=&gt;process.exit(r.ok?0:1)).catch(()=&gt;process.exit(1))"</code></pre>

<p><code>--start-period</code> là tham số người ta hay bỏ qua rồi bị gọi dậy vì nó: trong khoảng đó, các lần trượt <em>không</em> tính vào <code>--retries</code>. Không có nó, một dịch vụ mất 15 giây để khởi động sẽ bị đánh dấu là không khoẻ và bị khởi động lại, rồi khởi động lại mãi mãi. Và theo chương 15: URL của health check phải là probe <em>liveness</em>, đừng là cái chạm vào cơ sở dữ liệu — nếu không một cú nấc của database sẽ khởi động lại toàn bộ container cùng lúc.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Phần tắt êm ở đây là thật và đã được đo: chương 13 ghi lại chuỗi log <code>SAN-SANG | BATDAU 1 | NHAN-SIGTERM | XONG 1 | DA-DONG</code> với tiến trình thoát sau 1296ms, so với 5ms và một job kẹt ở trạng thái active khi không xử lý SIGTERM. Đường deploy dùng <code>docker compose up -d --force-recreate</code>, mà dòng chú thích trong <code>deploy.sh</code> ghi rằng nó đổi container một cách nguyên tử thay vì <code>down &amp;&amp; up</code> — bản năng đúng. Lỗ hổng mà bài này chỉ ra là <em>không nơi nào đặt <code>stop_grace_period</code></em>, nên phép đổi ấy thừa kế bất kỳ mặc định nào mà bản Docker đang cài có, mà bảng ở trên cho thấy con số đó có thể là khoảng một giây. Với một API mà những route chậm nhất là các lời gọi AI tính bằng <em>hàng trăm</em> giây, đó là thứ đáng chốt lại cho rõ ràng.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/docker${REF}"><span class="lc-t">Code Lab · Docker</span><span class="lc-d">Entrypoint, tín hiệu và vòng đời container</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-989"><span class="lc-t">Code Lab · Health Checks &amp; Uptime</span><span class="lc-d">Những probe mà bộ điều phối hành động được</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 17.4 ─────────────────────────── */
    {
      title: '17.4 — Secrets: still there after you deleted them|||17.4 — Bí mật: vẫn còn nguyên sau khi bạn đã xoá',
      slug: 'nodejs-17-4-bi-mat-cau-hinh',
      type: 'VIDEO',
      description: 'Một Dockerfile xoá file .npmrc ngay trong cùng lệnh RUN — rồi docker history in ra nguyên cái token. Kèm cách vá bằng BuildKit secret mount và ranh giới build-time với runtime.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.4</span>
<h2>Secrets: still there after you deleted them</h2>
<p class="lead">A Docker image is not a folder. It is a stack of immutable layers, and deleting a file creates a <em>new</em> layer that hides it — the original bytes stay in the layer below, forever, for anyone who pulls the image. This lesson demonstrates that with a token that a careful-looking Dockerfile deletes on the very same line it creates it.</p>

<h3>The Dockerfile that looks correct</h3>
<pre><code>ARG NPM_TOKEN
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
COPY package*.json ./
RUN echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" &gt; .npmrc \\
    &amp;&amp; npm ci --omit=dev \\
    &amp;&amp; rm -f .npmrc                    # ← xoá NGAY trong cùng một RUN</code></pre>

<p>The deletion is in the same <code>RUN</code>, so the file does not exist in any layer's filesystem. That part is genuinely correct. Now search the built image:</p>

<div class="out">1) docker history --no-trunc:
     LỘ: npm_SIEUBIMAT123456
     LỘ: MatKhauThat

2) docker inspect --format '{{json .Config.Env}}':
     LỘ: MatKhauThat</div>

<div class="danger">
<p><strong>Both secrets are in the image, and neither is in a file.</strong> <code>docker history</code> stores <em>the command that created each layer</em>, with build arguments already substituted — so the token is sitting in the image metadata as plain text, readable by anyone who can pull it, no unpacking required. And <code>ENV DATABASE_URL=$DATABASE_URL</code> did something worse: it wrote the production database password into <code>Config.Env</code>, where it is not only readable but automatically present in the environment of every container started from that image.</p>
</div>

<p>The thing that makes this class of leak dangerous is that the mistake looks like the fix. Someone thought about the secret, added <code>rm -f</code>, and shipped it — and the review approved the deletion without checking whether deletion was the right mechanism.</p>

<h3>The correct mechanism: secret mounts</h3>
<p>BuildKit can mount a file into a single <code>RUN</code> without it ever becoming part of any layer or any history entry:</p>

<pre><code># syntax=docker/dockerfile:1
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci --omit=dev
COPY src ./src
CMD ["node", "src/index.js"]</code></pre>

<pre><code>docker build --secret id=npmrc,src=$HOME/.npmrc -t app .</code></pre>

<div class="out">docker history: 0 lần khớp
(cùng cái token đó, cùng cái ảnh đó, không còn dấu vết nào)</div>

<p>The file exists only for the duration of that one command, in a tmpfs, and is never written to a layer. No <code>rm</code> needed, because nothing was ever created.</p>

<h3>Build-time versus runtime: the line that decides everything</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Build-time (ARG)</span><span class="lz-d">Exists only during the build. Visible in <code>docker history</code>. Use for: versions, feature flags. ABSOLUTELY NOT for secrets</span></div>
  <div class="lz-node"><span class="lz-t">Secret mount</span><span class="lz-d">Exists for exactly one RUN, enters no layer and no history. Use for: private registry tokens, build-time SSH keys</span></div>
  <div class="lz-node"><span class="lz-t">Runtime (env container)</span><span class="lz-d">Supplied at <code>docker run</code>/compose time. NOT in the image. This is the right place for EVERY production secret</span></div>
</div>

<p>The rule that follows: <strong>one image, many environments.</strong> The same image tag runs in staging and production, and the only difference is the environment handed to it at start. An image that contains a database URL is an image that can only ever run in one place — and that has already leaked it.</p>

<div class="callout warn">
<p><strong>The Next.js exception, and it catches everyone.</strong> Variables prefixed <code>NEXT_PUBLIC_</code> are inlined into the JavaScript bundle <em>at build time</em>. They are not configuration; they are source code, shipped to the browser. Changing one requires a rebuild, not a restart — and putting a third-party API key in one publishes that key to every visitor. This project learned it the expensive way: a GIPHY key shipped as <code>NEXT_PUBLIC_GIPHY_API_KEY</code>, the build-time value missing, the client falling back to a revoked public key and 403-ing in production. The fix was a backend proxy route reading the key from runtime env.</p>
</div>

<h3>Where runtime secrets should live</h3>
<div class="kv-grid">
  <div class="kv"><span>A .env file on the server</span><b>Good enough for one VPS. It must be <code>chmod 600</code>, must live OUTSIDE the rsync directory, and must be in both .gitignore AND .dockerignore</b></div>
  <div class="kv"><span>Docker secrets / swarm</span><b>Mounted into <code>/run/secrets/*</code>, not in an environment variable, so it does not leak through <code>docker inspect</code></b></div>
  <div class="kv"><span>Vault / SSM / Secret Manager</span><b>Key rotation, access logs, permissions. Right for many servers, overkill for one</b></div>
  <div class="kv"><span>CI secrets</span><b>GitHub Actions secrets. Remember they do NOT reach the VPS on their own — they must be configured there separately</b></div>
</div>

<div class="pitfall">
<p><strong>A real trap:</strong> the single most common deploy failure caused by configuration is a new environment variable added to the local <code>.env</code>, added to <code>.env.example</code>, and then never added to the server. Local CI passes, the build passes, the container starts, and the feature fails at the first request with a message about an undefined value. The habit that prevents it: <strong>validate every required variable at boot and refuse to start without it</strong> — a container that fails immediately and loudly is far better than one that runs and is quietly broken.</p>
</div>

<pre><code>// config/env.ts — thà chết lúc khởi động còn hơn hỏng lúc chạy
const required = ['DATABASE_URL', 'JWT_SECRET', 'R2_ACCESS_KEY_ID'];
const missing = required.filter(k =&gt; !process.env[k]);
if (missing.length) {
  console.error('THIẾU BIẾN MÔI TRƯỜNG:', missing.join(', '));
  process.exit(1);
}</code></pre>

<h3>If a secret has already shipped</h3>
<p>Rotate it. Not "remove it from the image and rebuild" — <strong>rotate the credential itself</strong>. Deleting the layer does not un-pull the image from anyone who has it, and old tags may still exist in the registry, in a CI cache, on a developer's laptop. The only action that actually helps is making the leaked value worthless.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Runtime configuration lives in <code>/opt/cuonghoangdev/.env</code> on the VPS, outside the deployed tree, and the deploy script's rsync explicitly excludes <code>.env*</code> so values there survive every deploy. That arrangement is right and it has one documented sharp edge: appending a variable <em>while a deploy is running</em> does nothing, because that deploy already loaded the environment — the container has to be recreated afterwards. The project also carries the <code>NEXT_PUBLIC_</code> lesson as a permanent rule in its own instructions: third-party API keys never get that prefix; they go through an authenticated backend proxy so the key stays server-side and rotating it is a container restart rather than a rebuild.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/docker${REF}"><span class="lc-t">Code Lab · Docker</span><span class="lc-d">Build args, secrets and runtime configuration</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/deploy-vps${REF}#module-1005"><span class="lc-t">Code Lab · Securing a server</span><span class="lc-d">Where credentials belong on a VPS</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.4</span>
<h2>Bí mật: vẫn còn nguyên sau khi bạn đã xoá</h2>
<p class="lead">Một ảnh Docker không phải một thư mục. Nó là một chồng tầng bất biến, và việc xoá một file tạo ra một tầng <em>mới</em> che nó đi — những byte gốc vẫn nằm ở tầng dưới, mãi mãi, cho bất kỳ ai tải cái ảnh về. Bài này chứng minh điều đó bằng một cái token mà một Dockerfile trông rất cẩn thận đã xoá ngay trên chính dòng tạo ra nó.</p>

<h3>Cái Dockerfile trông có vẻ đúng</h3>
<pre><code>ARG NPM_TOKEN
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
COPY package*.json ./
RUN echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" &gt; .npmrc \\
    &amp;&amp; npm ci --omit=dev \\
    &amp;&amp; rm -f .npmrc                    # ← xoá NGAY trong cùng một RUN</code></pre>

<p>Lệnh xoá nằm trong cùng một <code>RUN</code>, nên file ấy không tồn tại trong hệ thống tệp của tầng nào. Phần đó thì đúng thật. Giờ đi tìm trong cái ảnh đã build:</p>

<div class="out">1) docker history --no-trunc:
     LỘ: npm_SIEUBIMAT123456
     LỘ: MatKhauThat

2) docker inspect --format '{{json .Config.Env}}':
     LỘ: MatKhauThat</div>

<div class="danger">
<p><strong>Cả hai bí mật đều nằm trong ảnh, và không cái nào nằm trong một file.</strong> <code>docker history</code> lưu <em>chính cái lệnh đã tạo ra mỗi tầng</em>, với tham số build đã được thay vào — nên cái token nằm chình ình trong metadata của ảnh ở dạng chữ thường, ai tải được ảnh là đọc được, chẳng cần giải nén gì. Còn <code>ENV DATABASE_URL=$DATABASE_URL</code> làm một chuyện tệ hơn: nó ghi mật khẩu database production vào <code>Config.Env</code>, nơi nó không chỉ đọc được mà còn tự động có mặt trong môi trường của <em>mọi</em> container khởi từ ảnh đó.</p>
</div>

<p>Thứ làm loại rò rỉ này nguy hiểm là <em>cái sai trông giống hệt cái đúng</em>. Có người đã nghĩ tới bí mật, đã thêm <code>rm -f</code>, và đưa lên — còn buổi review thì duyệt cái lệnh xoá mà không kiểm xem xoá có phải cơ chế đúng hay không.</p>

<h3>Cơ chế đúng: gắn bí mật (secret mount)</h3>
<p>BuildKit gắn được một file vào đúng một lệnh <code>RUN</code> mà nó không bao giờ trở thành một phần của tầng nào hay mục history nào:</p>

<pre><code># syntax=docker/dockerfile:1
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci --omit=dev
COPY src ./src
CMD ["node", "src/index.js"]</code></pre>

<pre><code>docker build --secret id=npmrc,src=$HOME/.npmrc -t app .</code></pre>

<div class="out">docker history: 0 lần khớp
(cùng cái token đó, cùng cái ảnh đó, không còn dấu vết nào)</div>

<p>File chỉ tồn tại trong khoảng thời gian của đúng lệnh đó, trong một tmpfs, và không bao giờ được ghi vào tầng nào. Không cần <code>rm</code>, vì chưa từng có gì được tạo ra.</p>

<h3>Build-time so với runtime: ranh giới quyết định mọi thứ</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Build-time (ARG)</span><span class="lz-d">Chỉ tồn tại trong lúc build. Nằm trong <code>docker history</code>. Dùng cho: phiên bản, cờ tính năng. TUYỆT ĐỐI KHÔNG cho bí mật</span></div>
  <div class="lz-node"><span class="lz-t">Secret mount</span><span class="lz-d">Tồn tại trong đúng một RUN, không vào tầng nào, không vào history. Dùng cho: token registry riêng, khoá SSH lúc build</span></div>
  <div class="lz-node"><span class="lz-t">Runtime (env của container)</span><span class="lz-d">Cấp lúc <code>docker run</code>/compose. KHÔNG nằm trong ảnh. Đây là chỗ đúng cho MỌI bí mật production</span></div>
</div>

<p>Quy tắc suy ra từ đó: <strong>một ảnh, nhiều môi trường.</strong> Cùng một tag ảnh chạy ở staging và ở production, và khác biệt duy nhất là cái môi trường được đưa cho nó lúc khởi động. Một cái ảnh có chứa URL database là một cái ảnh chỉ chạy được ở đúng một nơi — và là cái ảnh đã làm lộ URL đó rồi.</p>

<div class="callout warn">
<p><strong>Ngoại lệ của Next.js, và nó bẫy tất cả mọi người.</strong> Biến có tiền tố <code>NEXT_PUBLIC_</code> được nhúng thẳng vào bundle JavaScript <em>lúc build</em>. Chúng không phải cấu hình; chúng là mã nguồn, được gửi tới trình duyệt. Đổi một cái đòi hỏi build lại chứ không phải khởi động lại — và đặt khoá API của bên thứ ba vào một cái là công bố khoá ấy cho mọi khách truy cập. Dự án này học bài đó theo cách tốn kém: một khoá GIPHY được ship dưới dạng <code>NEXT_PUBLIC_GIPHY_API_KEY</code>, giá trị lúc build bị thiếu, client rơi về một khoá công cộng đã bị thu hồi và trả 403 ở production. Phép sửa là một route proxy ở backend đọc khoá từ env lúc chạy.</p>
</div>

<h3>Bí mật lúc chạy nên nằm ở đâu</h3>
<div class="kv-grid">
  <div class="kv"><span>File .env trên máy chủ</span><b>Đủ dùng cho một VPS. Phải <code>chmod 600</code>, phải nằm NGOÀI thư mục rsync, phải nằm trong .gitignore VÀ .dockerignore</b></div>
  <div class="kv"><span>Docker secrets / swarm</span><b>Gắn vào <code>/run/secrets/*</code>, không nằm trong biến môi trường nên không lộ qua <code>docker inspect</code></b></div>
  <div class="kv"><span>Vault / SSM / Secret Manager</span><b>Có xoay khoá, có nhật ký truy cập, có phân quyền. Đúng cho nhiều máy chủ, thừa cho một cái</b></div>
  <div class="kv"><span>Secret của CI</span><b>GitHub Actions secrets. Nhớ rằng chúng KHÔNG tự tới được VPS — phải cấu hình riêng ở đó</b></div>
</div>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> lỗi deploy do cấu hình phổ biến nhất là một biến môi trường mới được thêm vào <code>.env</code> ở máy local, thêm vào <code>.env.example</code>, rồi không bao giờ được thêm lên máy chủ. CI ở local đậu, build đậu, container khởi động được, và tính năng hỏng ở request đầu tiên với một thông điệp về giá trị undefined. Thói quen ngăn được nó: <strong>kiểm mọi biến bắt buộc lúc khởi động và từ chối chạy nếu thiếu</strong> — một container chết ngay lập tức và ầm ĩ tốt hơn hẳn một cái chạy được mà hỏng trong im lặng.</p>
</div>

<pre><code>// config/env.ts — thà chết lúc khởi động còn hơn hỏng lúc chạy
const required = ['DATABASE_URL', 'JWT_SECRET', 'R2_ACCESS_KEY_ID'];
const missing = required.filter(k =&gt; !process.env[k]);
if (missing.length) {
  console.error('THIẾU BIẾN MÔI TRƯỜNG:', missing.join(', '));
  process.exit(1);
}</code></pre>

<h3>Nếu một bí mật đã lên tới nơi rồi</h3>
<p>Hãy xoay khoá. Không phải "gỡ nó khỏi ảnh rồi build lại" — <strong>hãy xoay chính cái thông tin xác thực đó</strong>. Xoá một tầng không lấy lại được cái ảnh từ những ai đã tải về, và các tag cũ có thể vẫn còn trong registry, trong cache CI, trên laptop của một lập trình viên. Hành động duy nhất thật sự có ích là làm cho giá trị bị lộ trở nên vô dụng.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Cấu hình lúc chạy nằm ở <code>/opt/cuonghoangdev/.env</code> trên VPS, nằm ngoài cây thư mục được deploy, và lệnh rsync của script deploy loại trừ tường minh <code>.env*</code> nên các giá trị ở đó sống sót qua mọi lần deploy. Cách sắp xếp ấy là đúng và nó có đúng một cạnh sắc đã được ghi lại: thêm một biến vào <em>trong lúc một lần deploy đang chạy</em> thì không có tác dụng gì, vì lần deploy đó đã nạp môi trường xong rồi — phải tạo lại container sau đó. Dự án cũng mang bài học <code>NEXT_PUBLIC_</code> vào thành một quy tắc vĩnh viễn trong tài liệu hướng dẫn của chính nó: khoá API của bên thứ ba không bao giờ được mang tiền tố đó; chúng đi qua một proxy backend có xác thực để khoá ở lại phía máy chủ và việc xoay khoá là một lần khởi động lại container chứ không phải một lần build lại.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/docker${REF}"><span class="lc-t">Code Lab · Docker</span><span class="lc-d">Build arg, secret và cấu hình lúc chạy</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/deploy-vps${REF}#module-1005"><span class="lc-t">Code Lab · Securing a server</span><span class="lc-d">Thông tin xác thực nên nằm ở đâu trên VPS</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 17.5 ─────────────────────────── */
    {
      title: '17.5 — Zero downtime: 1,5% lost, or 0%|||17.5 — Deploy không gián đoạn: mất 1,5%, hay mất 0%',
      slug: 'nodejs-17-5-deploy-khong-gian-doan',
      simulations: [
        {
          url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-5-deploy-khong-gian-doan.mp4',
          poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-5-deploy-khong-gian-doan.jpg',
          scenario: 'nodejs-blue-green',
          durationSeconds: 12,
          caption: { en: "Zero-downtime deploy: 1.5% or 0%", vi: "Deploy không gián đoạn: 1,5% hay 0%" },
        },
        {
          url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-5-deploy-khong-gian-doan--nginx-proxy.mp4',
          poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-5-deploy-khong-gian-doan--nginx-proxy.jpg',
          durationSeconds: 24,
          scenario: 'nginx-proxy',
          caption: { en: 'The proxy in front: routing, and the client IP it erases', vi: 'Proxy đứng trước: định tuyến, và địa chỉ IP nó xoá mất' },
        },
      ],
      type: 'VIDEO',
      description: 'Bắn request liên tục trong lúc deploy và đếm số cái hỏng: kiểu dừng-rồi-chạy-lại mất 1,5%, "blue-green" tự chế cũng mất 1,5% — chỉ khi có proxy đứng trước mới ra 0/327.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.5</span>
<h2>Zero downtime: 1,5% lost, or 0%</h2>
<p class="lead">"Zero-downtime deploy" is a phrase people use about setups they have never measured. This lesson measures three of them the only way that means anything: fire requests continuously during the deploy and count how many fail. The result includes one arrangement that is widely described as zero-downtime and is not.</p>

<h3>Method 1: stop, then start</h3>
<p>The obvious approach, and what <code>docker compose up -d --force-recreate</code> does to a single container. A probe hammers <code>/health</code> throughout:</p>

<div class="out">thời gian gián đoạn: 0,58s
request: 254 tổng, 250 thành công, 4 HỎNG   (1,5% mất)</div>

<p>Four failures in a nine-second window. On a service handling 200 requests per second that is roughly 115 real users seeing an error, per deploy — and this project deploys several times a day.</p>

<h3>Method 2: "blue-green" without a proxy</h3>
<p>The standard advice: start the new container, wait until it is healthy, only then remove the old one. Implemented literally — new container on a second port, health-check it, remove the old one, bind the new one to the real port:</p>

<div class="out">thời gian đổi: 1,12s
request: 250 tổng, 246 thành công, 4 HỎNG   (1,6% mất)</div>

<div class="danger">
<p><strong>Exactly the same loss.</strong> Health-checking the new container before removing the old one is genuinely valuable — if the new image is broken, the old one is still serving, which is the difference between a failed deploy and an outage. But it does <em>nothing</em> for the gap, because the gap was never about which container was healthy. <strong>The outage is the port rebind.</strong> Between the instant the old container releases port 3730 and the instant the new one binds it, there is no listener, and every request in that window gets connection-refused. Calling this "blue-green" is where the confusion starts: the pattern is correct, the implementation left out the piece that makes it work.</p>
</div>

<h3>Method 3: blue-green with something in front</h3>
<p>Add a reverse proxy that owns the public port permanently and forwards to whichever container is current. Now the swap is a change of destination, not a change of listener:</p>

<pre><code>1. dựng GREEN ở một cổng khác           docker run -d --name green -p 3741:3000 app:new
2. chờ GREEN thật sự KHOẺ               until curl -sf .../health; do sleep 0.05; done
3. proxy trỏ sang GREEN                 (nginx -s reload / đổi upstream)
4. GIỜ mới bỏ BLUE                      docker rm -f blue</code></pre>

<div class="out">thời gian đổi: 0,92s
request: 327 tổng, 327 thành công, 0 HỎNG   (0% mất)</div>

<p><strong>327 out of 327.</strong> The public port never closed, because the proxy never restarted. That single structural difference — something long-lived owning the address — is the whole of zero-downtime deployment. Everything else is detail.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">The proxy holds the public port PERMANENTLY</span><span class="lz-d">nginx, Traefik, or your provider's load balancer. It does NOT restart when you deploy</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Bring the new version up ALONGSIDE the old one</span><span class="lz-d">A different port or a different container name. The old one is still serving</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Health-check the NEW one until it is genuinely ready</span><span class="lz-d">Not "the container started" but "the route answered". This is the gate</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Switch the proxy's target</span><span class="lz-d">Reload the config. Open connections drain out of the old one by themselves</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">Wait out the grace period before dropping the old one</span><span class="lz-d">Lesson 17.3: SIGTERM plus enough time for in-flight requests to finish</span></div>
</div>

<h3>Why the health check must be the gate</h3>
<p>"Container started" and "application ready" are separated by however long your app takes to connect to its database, warm its cache and mount its routes. Deploying on the first signal instead of the second produces the most confusing kind of outage: <code>docker ps</code> says everything is up, and every request 502s. The gate must be a real HTTP response from a real route:</p>

<pre><code># ĐÚNG: chờ đúng cái mà người dùng sẽ gọi
until curl -sf http://127.0.0.1:3741/health/live &gt;/dev/null; do sleep 0.05; done

# SAI: 'docker ps' nói nó chạy rồi ≠ nó nhận việc được rồi
docker ps | grep green &amp;&amp; echo "sẵn sàng!"</code></pre>

<h3>Rolling versus blue-green</h3>
<div class="kv-grid">
  <div class="kv"><span>Blue-green</span><b>Run 2 complete versions side by side and switch all at once. Instant rollback (switch back). Needs double the resources during the switch</b></div>
  <div class="kv"><span>Rolling</span><b>Replace one replica at a time. Needs only a little extra resource. For a while BOTH versions serve — so the API must be backward-compatible</b></div>
  <div class="kv"><span>Canary</span><b>Push 5% of traffic to the new version, watch the metrics (chapter 15), then push the rest. The safest, and the most complex infrastructure</b></div>
  <div class="kv"><span>Recreate</span><b>Stop everything, then start again. Exactly the 1.5% above. Acceptable for internal tools, not for a product</b></div>
</div>

<div class="callout warn">
<p><strong>The constraint rolling deploys impose on your code.</strong> During a rolling deploy, version N and version N+1 are both live and both talking to the same database. That means every schema change must be backwards compatible with the code still running: add a nullable column, deploy code that writes it, backfill, <em>then</em> make it NOT NULL in a later deploy. Chapter 7 measured the failure mode of skipping that — a migration that could not apply, then <code>P3009</code> blocking every deploy afterwards.</p>
</div>

<div class="pitfall">
<p><strong>A real trap:</strong> WebSocket connections do not roll. An HTTP request lasts milliseconds and finishes during the grace period; a Socket.IO connection lasts hours and is simply cut. Chapter 11 measured what the client sees: reconnect after 1.053ms with a <em>new</em> socket id, rooms not rejoined, and the five messages emitted while it was away received as zero — gone. Every deploy is a disconnect storm for realtime users, and the fix is on the client (rejoin rooms and refetch missed state on reconnect), not the deploy.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> The deploy has the right pieces and one honest gap. nginx owns ports 80 and 443 permanently and is not restarted during a deploy — that is the structural property this lesson says matters most. <code>deploy.sh</code> uses <code>docker compose up -d --force-recreate</code>, whose comment explains it swaps atomically rather than <code>down &amp;&amp; up</code>, and afterwards waits for the backend's health endpoint before continuing. The gap is that the health check runs <em>after</em> the swap rather than gating it: the new container takes the name and the network alias, and nginx points at the new one from that moment, so there is a real window between "container recreated" and "application answering". That is the measured 1,5%, and closing it is what method 3 above describes.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/deploy-vps${REF}"><span class="lc-t">Code Lab · Deploy to a VPS</span><span class="lc-d">Zero-downtime swaps and rollbacks</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nginx${REF}#module-915"><span class="lc-t">Code Lab · nginx</span><span class="lc-d">Reverse proxy, upstreams and reloads</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.5</span>
<h2>Deploy không gián đoạn: mất 1,5%, hay mất 0%</h2>
<p class="lead">"Deploy không gián đoạn" là một cụm từ người ta dùng cho những hệ thống họ chưa bao giờ đo. Bài này đo ba cách theo kiểu duy nhất có ý nghĩa: bắn request liên tục trong suốt lần deploy và đếm xem bao nhiêu cái hỏng. Kết quả bao gồm một cách sắp xếp được mô tả rộng rãi là không gián đoạn — và không phải.</p>

<h3>Cách 1: dừng, rồi chạy lại</h3>
<p>Cách hiển nhiên, và là thứ <code>docker compose up -d --force-recreate</code> làm với một container đơn lẻ. Một bộ dò nện <code>/health</code> suốt quá trình:</p>

<div class="out">thời gian gián đoạn: 0,58s
request: 254 tổng, 250 thành công, 4 HỎNG   (1,5% mất)</div>

<p>Bốn lần hỏng trong một cửa sổ chín giây. Trên một dịch vụ xử lý 200 request mỗi giây thì đó là khoảng 115 người dùng thật nhìn thấy lỗi, mỗi lần deploy — và dự án này deploy vài lần một ngày.</p>

<h3>Cách 2: "blue-green" mà không có proxy</h3>
<p>Lời khuyên tiêu chuẩn: dựng container mới, chờ nó khoẻ, rồi mới bỏ cái cũ. Cài đặt đúng theo nghĩa đen — container mới ở cổng thứ hai, kiểm khoẻ, bỏ cái cũ, rồi gắn cái mới vào cổng thật:</p>

<div class="out">thời gian đổi: 1,12s
request: 250 tổng, 246 thành công, 4 HỎNG   (1,6% mất)</div>

<div class="danger">
<p><strong>Mất y hệt như cũ.</strong> Việc kiểm khoẻ cái mới trước khi bỏ cái cũ thật sự có giá trị — nếu ảnh mới hỏng thì cái cũ vẫn đang phục vụ, đó là khác biệt giữa một lần deploy thất bại với một lần sập. Nhưng nó <em>không</em> làm gì được cho cái khe hở, vì cái khe hở chưa bao giờ liên quan tới việc container nào khoẻ. <strong>Cú sập chính là lúc GẮN LẠI CỔNG.</strong> Giữa khoảnh khắc container cũ nhả cổng 3730 và khoảnh khắc cái mới chiếm lấy nó, không có ai lắng nghe cả, và mọi request rơi vào cửa sổ đó đều bị từ chối kết nối. Gọi cách này là "blue-green" chính là nơi sinh ra hiểu lầm: khuôn mẫu thì đúng, còn phần cài đặt bỏ sót đúng cái mảnh làm cho nó hoạt động.</p>
</div>

<h3>Cách 3: blue-green có thứ gì đó đứng trước</h3>
<p>Thêm một reverse proxy sở hữu cổng công khai vĩnh viễn và chuyển tiếp tới container nào đang là hiện hành. Giờ phép đổi là đổi <em>đích đến</em>, không phải đổi <em>người lắng nghe</em>:</p>

<pre><code>1. dựng GREEN ở một cổng khác           docker run -d --name green -p 3741:3000 app:new
2. chờ GREEN thật sự KHOẺ               until curl -sf .../health; do sleep 0.05; done
3. proxy trỏ sang GREEN                 (nginx -s reload / đổi upstream)
4. GIỜ mới bỏ BLUE                      docker rm -f blue</code></pre>

<div class="out">thời gian đổi: 0,92s
request: 327 tổng, 327 thành công, 0 HỎNG   (0% mất)</div>

<p><strong>327 trên 327.</strong> Cổng công khai chưa bao giờ đóng, vì proxy chưa bao giờ khởi động lại. Đúng một khác biệt về cấu trúc ấy — có một thứ sống lâu sở hữu địa chỉ — chính là toàn bộ nội dung của việc deploy không gián đoạn. Mọi thứ còn lại là chi tiết.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Proxy giữ cổng công khai VĨNH VIỄN</span><span class="lz-d">nginx, Traefik, hay cân bằng tải của nhà cung cấp. Nó KHÔNG khởi động lại khi bạn deploy</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Dựng phiên bản mới BÊN CẠNH cái cũ</span><span class="lz-d">Cổng khác hoặc tên container khác. Cái cũ vẫn đang phục vụ</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Kiểm khoẻ cái MỚI cho tới khi nó thật sự sẵn sàng</span><span class="lz-d">Không phải "container đã chạy" mà là "route đã trả lời". Đây là chốt chặn</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Đổi đích của proxy</span><span class="lz-d">Nạp lại cấu hình. Kết nối đang mở tự chảy hết ở cái cũ</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">Chờ hết khoảng ân hạn rồi mới bỏ cái cũ</span><span class="lz-d">Bài 17.3: SIGTERM + đủ thời gian để request đang chạy hoàn thành</span></div>
</div>

<h3>Vì sao health check phải là cái chốt</h3>
<p>"Container đã khởi động" và "ứng dụng đã sẵn sàng" cách nhau đúng bằng khoảng thời gian app của bạn cần để kết nối cơ sở dữ liệu, làm ấm cache và gắn xong các route. Deploy dựa vào tín hiệu thứ nhất thay vì tín hiệu thứ hai sinh ra kiểu sập khó hiểu nhất: <code>docker ps</code> nói mọi thứ đang chạy, và mọi request đều 502. Cái chốt phải là một phản hồi HTTP thật từ một route thật:</p>

<pre><code># ĐÚNG: chờ đúng cái mà người dùng sẽ gọi
until curl -sf http://127.0.0.1:3741/health/live &gt;/dev/null; do sleep 0.05; done

# SAI: 'docker ps' nói nó chạy rồi ≠ nó nhận việc được rồi
docker ps | grep green &amp;&amp; echo "sẵn sàng!"</code></pre>

<h3>Rolling so với blue-green</h3>
<div class="kv-grid">
  <div class="kv"><span>Blue-green</span><b>Chạy song song 2 phiên bản đầy đủ, đổi hết một lúc. Quay lui tức thì (đổi ngược lại). Cần gấp đôi tài nguyên trong lúc đổi</b></div>
  <div class="kv"><span>Rolling</span><b>Thay từng bản sao một. Chỉ cần thêm ít tài nguyên. Có lúc CẢ HAI phiên bản cùng phục vụ — API phải tương thích ngược</b></div>
  <div class="kv"><span>Canary</span><b>Đẩy 5% lưu lượng sang bản mới, xem metric (chương 15), rồi mới đẩy nốt. An toàn nhất, hạ tầng phức tạp nhất</b></div>
  <div class="kv"><span>Recreate</span><b>Dừng hết rồi chạy lại. Đúng 1,5% ở trên. Chấp nhận được cho công cụ nội bộ, không cho sản phẩm</b></div>
</div>

<div class="callout warn">
<p><strong>Ràng buộc mà rolling deploy áp lên code của bạn.</strong> Trong một lần rolling deploy, phiên bản N và N+1 cùng sống và cùng nói chuyện với một cơ sở dữ liệu. Nghĩa là mọi thay đổi lược đồ đều phải tương thích ngược với đoạn code vẫn đang chạy: thêm một cột cho phép NULL, deploy code ghi vào nó, điền dữ liệu cũ, <em>rồi</em> mới đặt NOT NULL ở một lần deploy sau. Chương 7 đã đo kiểu hỏng khi bỏ qua bước đó — một migration không áp được, rồi <code>P3009</code> chặn mọi lần deploy về sau.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> kết nối WebSocket không "rolling" được. Một request HTTP kéo dài vài mili-giây và kết thúc trong khoảng ân hạn; một kết nối Socket.IO kéo dài hàng giờ và đơn giản là bị cắt. Chương 11 đã đo cái mà client nhìn thấy: kết nối lại sau 1.053ms với một socket id <em>mới</em>, các phòng không được vào lại, và năm tin nhắn phát ra lúc nó vắng mặt thì nhận được con số không — mất trắng. Mỗi lần deploy là một cơn bão đứt kết nối với người dùng realtime, và phép sửa nằm ở phía client (vào lại phòng và lấy lại trạng thái đã lỡ khi kết nối lại), không nằm ở phần deploy.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Phần deploy có đúng các mảnh cần có và một lỗ hổng trung thực. nginx sở hữu cổng 80 và 443 vĩnh viễn và không bị khởi động lại trong lúc deploy — chính là tính chất cấu trúc mà bài này nói là quan trọng nhất. <code>deploy.sh</code> dùng <code>docker compose up -d --force-recreate</code>, với dòng chú thích giải thích rằng nó đổi container một cách nguyên tử thay vì <code>down &amp;&amp; up</code>, và sau đó chờ endpoint health của backend rồi mới đi tiếp. Lỗ hổng là phép kiểm khoẻ chạy <em>sau</em> khi đã đổi chứ không phải làm chốt chặn cho phép đổi: container mới nhận lấy cái tên và bí danh mạng, nên nginx trỏ vào cái mới ngay từ khoảnh khắc đó, và tồn tại một cửa sổ thật giữa "container đã tạo lại" với "ứng dụng đã trả lời". Đó chính là 1,5% đã đo được, và đóng nó lại chính là điều cách 3 ở trên mô tả.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/deploy-vps${REF}"><span class="lc-t">Code Lab · Deploy lên VPS</span><span class="lc-d">Đổi phiên bản không gián đoạn và quay lui</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nginx${REF}#module-915"><span class="lc-t">Code Lab · nginx</span><span class="lc-d">Reverse proxy, upstream và nạp lại cấu hình</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 17.6 ─────────────────────────── */
    {
      title: '17.6 — When the deploy lies: stale builds, smoke tests, rollback|||17.6 — Khi deploy nói dối: build cũ, smoke test, quay lui',
      slug: 'nodejs-17-6-deploy-hong-quay-lui',
      simulations: [
        {
          url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-6-deploy-hong-quay-lui--deploy-pipeline.mp4',
          poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-6-deploy-hong-quay-lui--deploy-pipeline.jpg',
          durationSeconds: 28,
          scenario: 'deploy-pipeline',
          options: { mode: 'nobuild' },
          caption: { en: 'The deploy that rsyncs but never rebuilds', vi: 'Cú deploy chỉ rsync mà không dựng lại ảnh' },
        },
        {
          url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-6-deploy-hong-quay-lui--cicd-pipeline.mp4',
          poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-6-deploy-hong-quay-lui--cicd-pipeline.jpg',
          durationSeconds: 26,
          scenario: 'cicd-pipeline',
          options: { mode: 'race' },
          caption: { en: 'Two workflows racing on one push', vi: 'Hai workflow giành nhau trên cùng một cú push' },
        },
        {
          url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-6-deploy-hong-quay-lui--git-flow.mp4',
          poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-17-6-deploy-hong-quay-lui--git-flow.jpg',
          durationSeconds: 28,
          scenario: 'git-flow',
          caption: { en: 'Commit, branch, merge and the revert that rolls back', vi: 'Commit, nhánh, gộp và cú revert để quay lui' },
        },
      ],
      type: 'VIDEO',
      description: 'Một lần deploy báo thành công, container báo khoẻ, và một nửa API im lặng biến mất — sự cố có thật, cách chẩn đoán bằng một lệnh curl, và cái chốt chặn được thêm vào để nó không tái diễn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.6</span>
<h2>When the deploy lies: stale builds, smoke tests, rollback</h2>
<p class="lead">The deploy printed green. The container reports healthy. The health endpoint returns 200. And a feature that worked yesterday is gone. This lesson is about the failures that get past every check you have, why "healthy" is a much weaker claim than it sounds, and the two-line diagnostic that separates a stale build from an authentication problem in five seconds.</p>

<h3>The incident</h3>
<p>Real, on this project, 2026-07-02. Users reported that the GIF picker had stopped working and that chat history had "disappeared". Both had worked the day before. Re-logging in did not help. The container was up, the health check passed, and <code>dist/routes/gifs.routes.js</code> existed inside the image when someone went and looked.</p>

<p>The diagnosis took one command — unauthenticated <code>curl</code> against each route, reading only the status code:</p>

<div class="out">$ curl -s -o /dev/null -w "%{http_code}" https://cuongthai.com/api/v1/gifs
404

$ curl -s -o /dev/null -w "%{http_code}" https://cuongthai.com/api/v1/messages/threads
401</div>

<div class="danger">
<p><strong>401 and 404 mean completely different things here, and the difference is the entire diagnosis.</strong> <code>401</code> says "this route exists and wants credentials" — it is <em>mounted</em> and working. <code>404</code> says "there is no such route in this process". The file was in the image; the running process had never mounted it. A partial deploy had shipped a stale <code>dist/index.js</code>. The health check passed because it hits exactly one route, and that route was fine.</p>
</div>

<p>The rule worth memorising, because it costs five seconds and answers the question people spend hours on:</p>

<div class="kv-grid">
  <div class="kv"><span>200</span><b>The route is mounted and public. Alive</b></div>
  <div class="kv"><span>401 / 403</span><b>The route IS MOUNTED, it simply needs authentication. ALIVE — your problem is elsewhere</b></div>
  <div class="kv"><span>404</span><b>The route does NOT exist in the running process. A stale build or a half-finished deploy</b></div>
  <div class="kv"><span>502 / 503</span><b>The proxy is alive, the application is not. Read the container logs, not the route logs</b></div>
</div>

<p>Diagnose with <code>curl</code>, not with the browser. A browser sends cookies, follows redirects, caches aggressively and renders a generic error page for all four cases — it hides exactly the distinction you need.</p>

<h3>The guard: smoke-test that routes are mounted</h3>
<p>A health check that hits one route proves one route works. The fix is a smoke test that asserts every major module is actually mounted, run automatically at the end of every deploy, failing the deploy loudly if anything returns 404:</p>

<pre><code>for route in gifs messages/threads profile social/posts feed/posts \\
             friends notes courses snippets my-language interview/tracks; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:5000/api/v1/$route")
  if [ "$code" = "404" ]; then
    echo "LỖI: /api/v1/$route trả 404 — build cũ hoặc deploy dở dang"
    smoke_failed=true
  fi
done</code></pre>

<div class="callout warn">
<p><strong>The rule for adding routes to that list.</strong> Only param-less GET routes that return non-404 on a bare unauthenticated request. Adding <code>/stickers</code> (POST-only) or <code>/auth/login</code> (POST-only) makes every future deploy fail for the wrong reason, and a check that cries wolf gets deleted within a week. When you add a feature module, add one of its GET routes here — that is the moment the guard is cheapest to extend and the moment it is always forgotten.</p>
</div>

<h3>How a build goes stale in the first place</h3>
<div class="kv-grid">
  <div class="kv"><span>The deploy only rsynced and never rebuilt</span><b>Precisely the cause of the incident above. New source on disk, old image in the container</b></div>
  <div class="kv"><span>A layer cache hit it should not have</span><b>One <code>COPY</code> declared too narrowly makes Docker believe nothing changed</b></div>
  <div class="kv"><span>The build passed but the push failed</span><b>The registry keeps the old tag. <code>docker pull</code> silently pulls that same old image back</b></div>
  <div class="kv"><span>Tag <code>:latest</code></span><b>You cannot say which image is running, and you cannot roll back to "the previous one" because it has no name</b></div>
</div>

<p>The last one is worth stating as a rule: <strong>tag images with something immutable</strong> — the git SHA, or a version. <code>app:latest</code> cannot be rolled back to, cannot be audited, and cannot answer "which commit is production running". <code>app:2871889</code> answers all three.</p>

<h3>Rollback</h3>
<p>The fastest rollback is starting the previous image, which takes seconds and requires only that the image still exists and has a name:</p>

<pre><code># quay lui bằng ẢNH — nhanh nhất, vài giây
docker compose up -d --no-build backend    # với ảnh đã ghim ở tag trước

# quay lui bằng CODE — chậm hơn, nhưng lịch sử git thẳng thớm
git revert &lt;sha_xau&gt;
# chạy checklist trước push, rồi deploy như bình thường</code></pre>

<div class="danger">
<p><strong>The rule that keeps rollback from making things worse: reverting code does not revert the database.</strong> If the bad deploy included a migration, the schema is already changed, and starting the old image gives you old code against a new schema — which can be worse than the bug you are rolling back from. Any migration that drops a column or changes a type makes the rollback path unsafe. This is why the additive pattern from chapter 7 matters: add nullable, backfill, switch reads, only then remove — because every step of that sequence is individually reversible.</p>
</div>

<h3>The order to check things when a deploy fails</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Is the container running?</span><span class="lz-d"><code>docker ps</code>. Exit 137 means it was killed (out of memory, or the grace period expired — lesson 17.3)</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Did it say anything as it died?</span><span class="lz-d"><code>docker logs --tail=50</code>. A missing environment variable usually surfaces right here</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Is the route mounted?</span><span class="lz-d">curl for 401/404. This is the check that separates a stale build from everything else</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Did the migrations apply?</span><span class="lz-d"><code>prisma migrate status</code>. P3009 means a failed migration is BLOCKING every subsequent deploy</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">Still nothing?</span><span class="lz-d">ROLL BACK FIRST, investigate afterwards. Production is not the place to debug</span></div>
</div>

<p>Step 5 is the one experienced people follow and everyone else learns the hard way. The instinct under pressure is to find the cause first — and every minute spent on that is a minute of outage. Roll back, confirm the site is healthy, <em>then</em> reproduce it somewhere that is not production.</p>

<div class="pitfall">
<p><strong>A real trap:</strong> a deploy script that continues after a failed step turns one broken thing into several. Start every script with <code>set -euo pipefail</code> so an error stops it, and make each stage's success an explicit condition for the next. The version of this that bites hardest: a migration step that fails, followed by a container swap that succeeds — now new code is running against an old schema and the logs are full of errors about columns that do not exist.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> The smoke test in this lesson is not an example — it is in <code>deploy.sh</code>, added after the 2026-07-02 incident, and it lists twenty-odd routes across every feature module. The deploy also fails on it. Two other rules came out of the same week and are now written into the project's own instructions: <strong>always run a full <code>bash deploy.sh</code> after a code change, never <code>--no-build</code></strong> (which only rsyncs, leaves the old image running, and skips the smoke test — exactly how the stale build shipped), and diagnose route health with unauthenticated <code>curl</code> rather than the browser. The chat history was a separate bug entirely, found the same day: nothing was lost, a per-viewer <code>deletedAt</code> filter was hiding it. Two unrelated causes presenting as one symptom is normal during an incident, and it is the reason step 3 above is a <em>measurement</em> rather than a guess.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/deploy-vps${REF}"><span class="lc-t">Code Lab · Deploy to a VPS</span><span class="lc-d">Smoke tests, rollback and failed deploys</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-992"><span class="lc-t">Code Lab · Debugging Production Incidents</span><span class="lc-d">Working from symptom to cause under pressure</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.6</span>
<h2>Khi deploy nói dối: build cũ, smoke test, quay lui</h2>
<p class="lead">Lần deploy in ra màu xanh. Container báo khoẻ. Endpoint health trả 200. Và một tính năng hôm qua còn chạy thì biến mất. Bài này nói về những kiểu hỏng lọt qua mọi phép kiểm bạn có, vì sao "khoẻ" là một lời khẳng định yếu hơn nhiều so với vẻ ngoài của nó, và cái lệnh chẩn đoán hai dòng phân biệt được một build cũ với một vấn đề xác thực trong năm giây.</p>

<h3>Sự cố</h3>
<p>Có thật, trên chính dự án này, ngày 02/07/2026. Người dùng báo bộ chọn GIF ngừng hoạt động và lịch sử chat "biến mất". Cả hai hôm trước còn chạy. Đăng nhập lại không giúp gì. Container đang chạy, health check đậu, và file <code>dist/routes/gifs.routes.js</code> có tồn tại bên trong ảnh khi có người vào tận nơi xem.</p>

<p>Phép chẩn đoán tốn đúng một lệnh — <code>curl</code> không xác thực vào từng route, chỉ đọc mã trạng thái:</p>

<div class="out">$ curl -s -o /dev/null -w "%{http_code}" https://cuongthai.com/api/v1/gifs
404

$ curl -s -o /dev/null -w "%{http_code}" https://cuongthai.com/api/v1/messages/threads
401</div>

<div class="danger">
<p><strong>401 và 404 ở đây mang hai nghĩa hoàn toàn khác nhau, và chính khác biệt ấy là toàn bộ phép chẩn đoán.</strong> <code>401</code> nói "route này có tồn tại và nó đòi thông tin xác thực" — tức là nó <em>đã được gắn</em> và đang chạy. <code>404</code> nói "không có route nào như vậy trong tiến trình này". File thì nằm trong ảnh; tiến trình đang chạy thì chưa bao giờ gắn nó. Một lần deploy dở dang đã chở lên một file <code>dist/index.js</code> cũ. Health check đậu vì nó chỉ gọi đúng một route, mà route đó thì không sao.</p>
</div>

<p>Quy tắc đáng thuộc lòng, vì nó tốn năm giây và trả lời được câu hỏi mà người ta mất hàng giờ:</p>

<div class="kv-grid">
  <div class="kv"><span>200</span><b>Route đã gắn, công khai. Sống</b></div>
  <div class="kv"><span>401 / 403</span><b>Route ĐÃ GẮN, chỉ là cần xác thực. SỐNG — vấn đề của bạn nằm chỗ khác</b></div>
  <div class="kv"><span>404</span><b>Route KHÔNG tồn tại trong tiến trình đang chạy. Build cũ hoặc deploy dở dang</b></div>
  <div class="kv"><span>502 / 503</span><b>Proxy sống, ứng dụng thì không. Xem log container, không phải log route</b></div>
</div>

<p>Chẩn đoán bằng <code>curl</code>, đừng bằng trình duyệt. Trình duyệt gửi cookie, đi theo chuyển hướng, cache rất hăng và vẽ ra một trang lỗi chung chung cho cả bốn trường hợp — nó giấu đi đúng cái phân biệt mà bạn cần.</p>

<h3>Chốt chặn: smoke-test xem route có được gắn không</h3>
<p>Một health check gọi một route thì chứng minh được một route chạy. Phép sửa là một smoke test khẳng định mọi mô-đun lớn thật sự đã được gắn, chạy tự động ở cuối mỗi lần deploy, và làm hỏng cả lần deploy một cách ầm ĩ nếu có cái nào trả 404:</p>

<pre><code>for route in gifs messages/threads profile social/posts feed/posts \\
             friends notes courses snippets my-language interview/tracks; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:5000/api/v1/$route")
  if [ "$code" = "404" ]; then
    echo "LỖI: /api/v1/$route trả 404 — build cũ hoặc deploy dở dang"
    smoke_failed=true
  fi
done</code></pre>

<div class="callout warn">
<p><strong>Quy tắc khi thêm route vào danh sách đó.</strong> Chỉ những route GET không cần tham số và trả về khác 404 với một request trần không xác thực. Thêm <code>/stickers</code> (chỉ POST) hay <code>/auth/login</code> (chỉ POST) sẽ làm mọi lần deploy về sau hỏng vì lý do sai, và một phép kiểm cứ kêu oan thì bị xoá trong vòng một tuần. Khi bạn thêm một mô-đun tính năng, hãy thêm một route GET của nó vào đây — đó là lúc mở rộng chốt chặn rẻ nhất và cũng là lúc người ta luôn quên.</p>
</div>

<h3>Build trở nên cũ kỹ bằng cách nào</h3>
<div class="kv-grid">
  <div class="kv"><span>Deploy chỉ rsync, không build lại</span><b>Chính là nguyên nhân sự cố trên. Mã nguồn mới trên đĩa, ảnh cũ trong container</b></div>
  <div class="kv"><span>Cache tầng bị trúng nhầm</span><b>Một lệnh <code>COPY</code> khai quá hẹp làm Docker tưởng không có gì đổi</b></div>
  <div class="kv"><span>Build đậu nhưng đẩy hỏng</span><b>Registry giữ tag cũ. <code>docker pull</code> im lặng lấy lại đúng cái ảnh cũ</b></div>
  <div class="kv"><span>Tag <code>:latest</code></span><b>Không nói được ảnh nào đang chạy, và không quay lui về "cái trước" được vì nó không có tên</b></div>
</div>

<p>Cái cuối đáng phát biểu thành quy tắc: <strong>gắn tag ảnh bằng một thứ bất biến</strong> — mã SHA của git, hoặc một số phiên bản. <code>app:latest</code> thì không quay lui về được, không truy vết được, và không trả lời được câu "production đang chạy commit nào". <code>app:2871889</code> trả lời được cả ba.</p>

<h3>Quay lui</h3>
<p>Cách quay lui nhanh nhất là khởi động lại cái ảnh trước đó, mất vài giây và chỉ đòi hỏi cái ảnh ấy còn tồn tại và có tên:</p>

<pre><code># quay lui bằng ẢNH — nhanh nhất, vài giây
docker compose up -d --no-build backend    # với ảnh đã ghim ở tag trước

# quay lui bằng CODE — chậm hơn, nhưng lịch sử git thẳng thớm
git revert &lt;sha_xau&gt;
# chạy checklist trước push, rồi deploy như bình thường</code></pre>

<div class="danger">
<p><strong>Quy tắc giữ cho việc quay lui không làm mọi thứ tệ hơn: quay lui code KHÔNG quay lui cơ sở dữ liệu.</strong> Nếu lần deploy hỏng có kèm migration thì lược đồ đã đổi rồi, và khởi động lại ảnh cũ cho bạn code cũ chọi lược đồ mới — thứ có thể còn tệ hơn con bug bạn đang quay lui để tránh. Bất kỳ migration nào bỏ một cột hay đổi một kiểu đều làm đường quay lui trở nên không an toàn. Đó là lý do khuôn mẫu cộng thêm ở chương 7 quan trọng: thêm cột cho phép NULL, điền dữ liệu, chuyển phần đọc sang, rồi mới xoá — vì mỗi bước trong chuỗi đó đều đảo ngược được một cách độc lập.</p>
</div>

<h3>Thứ tự kiểm tra khi deploy hỏng</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Container có chạy không?</span><span class="lz-d"><code>docker ps</code>. Exit 137 = bị giết (hết RAM hoặc hết khoảng ân hạn, bài 17.3)</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Nó có nói gì lúc chết không?</span><span class="lz-d"><code>docker logs --tail=50</code>. Biến môi trường thiếu thường lộ ra ngay đây</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Route có được gắn không?</span><span class="lz-d">curl 401/404. Đây là phép kiểm phân biệt build cũ với mọi thứ khác</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Migration có áp được không?</span><span class="lz-d"><code>prisma migrate status</code>. P3009 = một migration hỏng đang CHẶN mọi lần deploy sau</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">Vẫn chưa ra?</span><span class="lz-d">QUAY LUI TRƯỚC, điều tra sau. Production không phải chỗ để gỡ lỗi</span></div>
</div>

<p>Bước 5 là bước người có kinh nghiệm tuân theo còn những người khác thì học bằng cách trả giá. Bản năng lúc căng thẳng là đi tìm nguyên nhân trước — và mỗi phút dành cho việc đó là một phút site đang chết. Hãy quay lui, xác nhận site đã khoẻ, <em>rồi</em> tái hiện nó ở một nơi không phải production.</p>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> một script deploy vẫn chạy tiếp sau khi một bước đã hỏng sẽ biến một thứ hỏng thành nhiều thứ hỏng. Hãy mở đầu mọi script bằng <code>set -euo pipefail</code> để một lỗi làm nó dừng lại, và biến việc thành công của từng giai đoạn thành điều kiện tường minh cho giai đoạn sau. Phiên bản cắn đau nhất của lỗi này: bước migration hỏng, rồi bước đổi container thành công — giờ code mới đang chạy chọi lược đồ cũ và log đầy lỗi về những cột không tồn tại.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Cái smoke test trong bài này không phải một ví dụ — nó nằm trong <code>deploy.sh</code>, được thêm vào sau sự cố ngày 02/07/2026, và nó liệt kê hơn hai chục route trải khắp mọi mô-đun tính năng. Lần deploy cũng hỏng theo nó. Hai quy tắc khác ra đời trong cùng tuần ấy và giờ đã được viết vào chính tài liệu hướng dẫn của dự án: <strong>luôn chạy một lần <code>bash deploy.sh</code> ĐẦY ĐỦ sau khi đổi code, không bao giờ dùng <code>--no-build</code></strong> (thứ chỉ rsync, để nguyên ảnh cũ đang chạy, và bỏ qua cả smoke test — chính xác là cách cái build cũ đã lên tới nơi), và chẩn đoán sức khoẻ route bằng <code>curl</code> không xác thực chứ đừng bằng trình duyệt. Còn chuyện lịch sử chat là một con bug hoàn toàn khác, phát hiện cùng ngày: chẳng có gì mất cả, một bộ lọc <code>deletedAt</code> theo từng người xem đang giấu nó đi. Hai nguyên nhân không liên quan biểu hiện thành một triệu chứng là chuyện bình thường trong lúc có sự cố, và đó là lý do bước 3 ở trên là một <em>phép đo</em> chứ không phải một phỏng đoán.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/deploy-vps${REF}"><span class="lc-t">Code Lab · Deploy lên VPS</span><span class="lc-d">Smoke test, quay lui và những lần deploy hỏng</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-992"><span class="lc-t">Code Lab · Debugging Production Incidents</span><span class="lc-d">Đi từ triệu chứng tới nguyên nhân trong lúc căng thẳng</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 17.7 ─────────────────────────── */
    {
      title: '17.7 — Chapter 17 quiz|||17.7 — Kiểm tra chương 17',
      slug: 'nodejs-17-7-quiz',
      type: 'QUIZ',
      description: 'Mười câu về cỡ ảnh, cache tầng, PID 1 và tín hiệu, bí mật trong tầng ảnh, deploy không gián đoạn và chẩn đoán build cũ — mỗi câu đều được phân định bởi một phép đo trong bài 17.1 tới 17.6.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question below is settled by a measurement in lessons 17.1 to 17.6 — the 440MB image that should have been 58,8MB, the two lines whose order made rebuilds 5,6× slower, the CMD form under which a carefully written shutdown handler never once ran, the token that <code>docker history</code> printed after <code>rm -f</code> deleted it, and the "blue-green" deploy that lost exactly as many requests as the naive one. Deployment is where a plausible-sounding setup is most often silently broken, so trust the measured column.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 17 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mọi câu dưới đây đều được phân định bởi một phép đo trong bài 17.1 tới 17.6 — cái ảnh 440MB lẽ ra chỉ nên 58,8MB, hai dòng mà thứ tự của chúng làm build lại chậm gấp 5,6 lần, dạng CMD khiến một handler tắt êm viết rất kỹ chưa từng chạy một lần nào, cái token mà <code>docker history</code> in ra sau khi <code>rm -f</code> đã xoá nó, và lần deploy "blue-green" mất đúng bằng số request như cách ngây thơ. Triển khai là nơi mà một cấu hình nghe rất hợp lý thường xuyên hỏng trong im lặng nhất, nên hãy tin vào cột số đo.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 800,
        questions: [
          {
            question: 'Four images of the same app measured 440,0MB (FROM node:22, COPY . ., npm install), 79,6MB (node:22-slim, npm ci --omit=dev), 58,8MB (alpine) and 77,5MB (multi-stage on slim). What accounts for almost all of the 440MB figure?|||Bốn ảnh của cùng một app đo được 440,0MB (FROM node:22, COPY . ., npm install), 79,6MB (node:22-slim, npm ci --omit=dev), 58,8MB (alpine) và 77,5MB (multi-stage trên slim). Cái gì chiếm gần như toàn bộ con số 440MB?',
            options: [
              'The application source code, which is larger than it looks once Docker stores it|||Mã nguồn ứng dụng, vốn lớn hơn vẻ ngoài khi Docker lưu lại',
              'A 381MB base image carrying a full toolchain, plus devDependencies (typescript, vitest) and the host node_modules copied in by COPY . .|||Một ảnh nền 381MB mang theo cả toolchain đầy đủ, cộng devDependencies (typescript, vitest) và node_modules của máy host bị COPY . . chép vào',
              'Docker layer metadata, which grows with the number of instructions|||Metadata tầng của Docker, thứ phình lên theo số lệnh trong Dockerfile',
              'npm install caching the package tarballs inside the image|||npm install cache các gói tarball ngay bên trong ảnh',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Changing one line in src/index.js and rebuilding took 3,00s with "COPY . . then RUN npm ci" and 0,54s with "COPY package*.json, RUN npm ci, then COPY src". Why?|||Sửa một dòng trong src/index.js rồi build lại mất 3,00s với "COPY . . rồi RUN npm ci" và 0,54s với "COPY package*.json, RUN npm ci, rồi COPY src". Vì sao?',
            options: [
              'The second Dockerfile copies fewer files, so the COPY instruction itself is faster|||Dockerfile thứ hai chép ít file hơn nên bản thân lệnh COPY nhanh hơn',
              'When an instruction’s inputs change, that layer and every layer after it rebuilds — putting COPY . . before npm ci makes every source edit invalidate the install|||Khi đầu vào của một lệnh đổi thì tầng đó và MỌI tầng sau nó bị build lại — đặt COPY . . trước npm ci làm mọi lần sửa mã nguồn đều vô hiệu hoá phần cài đặt',
              'npm ci is faster when package.json is the only file in the working directory|||npm ci chạy nhanh hơn khi package.json là file duy nhất trong thư mục làm việc',
              'BuildKit parallelises COPY and RUN when they are in that order|||BuildKit chạy song song COPY và RUN khi chúng nằm theo thứ tự đó',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'With "COPY . ." and no .dockerignore, the build transferred 64,27MB of context, took 6,33s and produced a 97,2MB image; with a four-line .dockerignore it transferred 235 bytes, took 3,06s and produced 79,6MB. Beyond speed and size, what danger did the 17,6MB represent?|||Với "COPY . ." và không có .dockerignore, lần build truyền 64,27MB context, mất 6,33s và cho ra ảnh 97,2MB; với một .dockerignore bốn dòng thì truyền 235 byte, mất 3,06s và cho ra 79,6MB. Ngoài tốc độ và dung lượng, 17,6MB đó đại diện cho mối nguy gì?',
            options: [
              'It was the .git directory, which slows down subsequent COPY operations|||Đó là thư mục .git, thứ làm chậm các lệnh COPY về sau',
              'It was the host’s node_modules compiled for the wrong architecture, sitting inside the image ready to shadow the correct one installed by npm ci|||Đó là node_modules của máy host biên dịch cho SAI kiến trúc, nằm trong ảnh sẵn sàng che mất bản đúng do npm ci cài',
              'It was build cache that would be invalidated on the next build anyway|||Đó là cache build mà lần build sau đằng nào cũng vô hiệu hoá',
              'It was duplicated layer metadata that inflates registry storage costs|||Đó là metadata tầng bị nhân đôi làm phình chi phí lưu trữ ở registry',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Three containers were stopped. With CMD ["npm","start"] the log showed "npm error signal SIGTERM"; with CMD node src/index.js (shell form) the log ended at startup; only with CMD ["node","src/index.js"] did the app log NHAN-SIGTERM and DA-DONG. What is the mechanism?|||Ba container được dừng. Với CMD ["npm","start"] log hiện "npm error signal SIGTERM"; với CMD node src/index.js (dạng shell) log dừng ở lúc khởi động; chỉ với CMD ["node","src/index.js"] thì app mới log ra NHAN-SIGTERM và DA-DONG. Cơ chế ở đây là gì?',
            options: [
              'Docker sends SIGTERM only to processes started with the exec form|||Docker chỉ gửi SIGTERM tới tiến trình khởi bằng dạng exec',
              'npm and sh intercept signals and convert them to SIGKILL before forwarding|||npm và sh chặn tín hiệu rồi chuyển thành SIGKILL trước khi chuyển tiếp',
              'Docker sends SIGTERM to PID 1, and whatever CMD names becomes PID 1 — npm dies without asking its child, and sh does not forward signals to children at all|||Docker gửi SIGTERM tới PID 1, và thứ nào được CMD gọi tên sẽ là PID 1 — npm chết mà không hỏi ý con nó, còn sh thì hoàn toàn không chuyển tiếp tín hiệu cho con',
              'The shell form runs in a subshell that exits before the signal is delivered|||Dạng shell chạy trong một subshell thoát ra trước khi tín hiệu được gửi tới',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'On Docker 29.5.3, a container serving a 3-second request was killed after about 1,26s with exit code 137 by a bare "docker stop", three times out of three, while "docker stop -t 5" exited cleanly with code 0 and the client got its 200. What should you conclude?|||Trên Docker 29.5.3, một container đang phục vụ một request 3 giây bị giết sau khoảng 1,26s với mã thoát 137 bởi lệnh "docker stop" trần, ba lần trên ba, trong khi "docker stop -t 5" thoát sạch với mã 0 và client nhận được 200. Bạn nên kết luận gì?',
            options: [
              'Exit 137 is 128+9 (SIGKILL) — the grace period ran out mid-request, so stop_grace_period must be set explicitly rather than inherited from a default you have not measured|||Mã 137 là 128+9 (SIGKILL) — khoảng ân hạn hết giữa lúc đang xử lý request, nên phải đặt stop_grace_period tường minh chứ đừng thừa kế một mặc định bạn chưa đo',
              'Exit 137 always means the container ran out of memory|||Mã 137 luôn có nghĩa là container hết bộ nhớ',
              'The application’s SIGTERM handler is buggy and should call process.exit() immediately|||Handler SIGTERM của ứng dụng bị lỗi và nên gọi process.exit() ngay lập tức',
              'The documented 10-second default applied and the request simply took longer than that|||Mặc định 10 giây như tài liệu ghi đã được áp dụng và request đơn giản là mất lâu hơn thế',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A Dockerfile wrote a token into .npmrc, ran npm ci, and deleted the file with rm -f in the SAME RUN instruction. docker history --no-trunc still printed the token, and docker inspect printed the DATABASE_URL. Why?|||Một Dockerfile ghi một token vào .npmrc, chạy npm ci, rồi xoá file bằng rm -f trong CÙNG một lệnh RUN. docker history --no-trunc vẫn in ra cái token, và docker inspect in ra DATABASE_URL. Vì sao?',
            options: [
              'rm -f only marks files as deleted; the bytes remain in the layer filesystem|||rm -f chỉ đánh dấu file là đã xoá; các byte vẫn nằm trong hệ thống tệp của tầng',
              'docker history stores the command that created each layer with build args already substituted, and ENV values are written into Config.Env — neither is a file, so deleting files cannot help|||docker history lưu chính cái lệnh đã tạo ra mỗi tầng với build arg đã được thay vào, còn giá trị ENV thì được ghi vào Config.Env — cả hai đều không phải file, nên xoá file không cứu được',
              'The token was cached in the BuildKit layer cache and leaked from there|||Token bị cache trong bộ nhớ đệm tầng của BuildKit và rò rỉ từ đó',
              'npm wrote a copy of the token into package-lock.json during npm ci|||npm đã ghi một bản sao của token vào package-lock.json trong lúc chạy npm ci',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Measured during a deploy with a probe running throughout: "stop then start" lost 4 of 254 requests (1,5%); "start new container, health-check it, remove old, bind new to the real port" lost 4 of 250 (1,6%); "reverse proxy owns the public port, switch upstream" lost 0 of 327. What does the second result show?|||Đo trong lúc deploy với một bộ dò chạy suốt: "dừng rồi chạy lại" mất 4 trên 254 request (1,5%); "dựng container mới, kiểm khoẻ, bỏ cái cũ, gắn cái mới vào cổng thật" mất 4 trên 250 (1,6%); "reverse proxy giữ cổng công khai, đổi upstream" mất 0 trên 327. Kết quả thứ hai cho thấy điều gì?',
            options: [
              'The health check was too slow, and a faster one would have closed the gap|||Phép kiểm khoẻ quá chậm, một cái nhanh hơn sẽ đóng được khe hở',
              'Health-checking before removing the old container protects against a broken image but does nothing for the gap — the outage is the port rebind, so something long-lived must own the address|||Kiểm khoẻ trước khi bỏ container cũ bảo vệ bạn khỏi một ảnh hỏng nhưng không làm gì được cho khe hở — cú sập chính là lúc gắn lại cổng, nên phải có một thứ sống lâu sở hữu địa chỉ',
              'Blue-green deployment does not work with Docker and requires Kubernetes|||Deploy blue-green không chạy với Docker và bắt buộc phải có Kubernetes',
              'The two results are within noise; both are effectively zero-downtime|||Hai kết quả nằm trong sai số của nhau; cả hai coi như đều không gián đoạn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'During a real incident the GIF picker was dead while chat still worked. Unauthenticated curl returned 404 for /api/v1/gifs and 401 for /api/v1/messages/threads, even though the route file existed inside the image. What did that pair of status codes prove?|||Trong một sự cố thật, bộ chọn GIF chết trong khi chat vẫn chạy. Lệnh curl không xác thực trả 404 cho /api/v1/gifs và 401 cho /api/v1/messages/threads, dù file route có tồn tại bên trong ảnh. Cặp mã trạng thái đó chứng minh điều gì?',
            options: [
              'The GIF route required authentication that had expired, so re-logging in would fix it|||Route GIF cần xác thực mà phiên đã hết hạn, nên đăng nhập lại là xong',
              '401 means mounted-but-needs-auth while 404 means the route does not exist in the running process — so the container was running a stale build, not an auth problem|||401 nghĩa là ĐÃ GẮN nhưng cần xác thực, còn 404 nghĩa là route không tồn tại trong tiến trình đang chạy — nên container đang chạy một build cũ, không phải vấn đề xác thực',
              'The nginx configuration was missing a location block for /gifs|||Cấu hình nginx thiếu một khối location cho /gifs',
              'Nothing conclusive; both codes can be produced by an unauthenticated request|||Không kết luận được gì; cả hai mã đều có thể sinh ra từ một request không xác thực',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'After that incident a smoke test was added to the deploy script, hitting ~20 GET routes unauthenticated and failing the deploy on any 404. What is the rule for which routes belong in that list?|||Sau sự cố đó, một smoke test được thêm vào script deploy, gọi khoảng 20 route GET không xác thực và làm hỏng lần deploy nếu có cái nào trả 404. Quy tắc để chọn route đưa vào danh sách đó là gì?',
            options: [
              'Every route in the application, so coverage is complete|||Mọi route trong ứng dụng, để phủ cho đầy đủ',
              'Only the routes that return 200, since 401 indicates a problem|||Chỉ những route trả 200, vì 401 là dấu hiệu có vấn đề',
              'Only param-less GET routes that return non-404 on a bare unauthenticated request — adding a POST-only route like /auth/login makes every future deploy fail for the wrong reason|||Chỉ những route GET không cần tham số và trả khác 404 với một request trần không xác thực — thêm một route chỉ-POST như /auth/login sẽ làm mọi lần deploy về sau hỏng vì lý do sai',
              'Only routes added in the current release, to keep the check fast|||Chỉ những route mới thêm ở bản phát hành hiện tại, để phép kiểm chạy nhanh',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A deploy that included a migration turns out to be bad and must be rolled back. What is the constraint that most often makes the rollback dangerous?|||Một lần deploy có kèm migration hoá ra là hỏng và phải quay lui. Ràng buộc nào thường làm cho việc quay lui trở nên nguy hiểm nhất?',
            options: [
              'Reverting code does not revert the database — old code against a new schema can be worse than the bug, which is why migrations should be additive and individually reversible|||Quay lui code KHÔNG quay lui cơ sở dữ liệu — code cũ chọi lược đồ mới có thể tệ hơn cả con bug, đó là lý do migration nên chỉ cộng thêm và đảo ngược được từng bước',
              'Docker cannot restart a previous image once a newer one has the same tag|||Docker không khởi động lại được ảnh trước đó khi một ảnh mới hơn đã mang cùng tag',
              'git revert rewrites history and breaks other developers’ branches|||git revert viết lại lịch sử và làm hỏng nhánh của các lập trình viên khác',
              'The rollback must wait for the full stop_grace_period on every container|||Việc quay lui phải chờ hết stop_grace_period trên mọi container',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
    /* END-LESSONS */
  ],
};
