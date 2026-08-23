/**
 * Prisma ORM — Chương 11: Đưa lên production.
 * Engine và binaryTargets · Dockerfile nhiều tầng · migration trong đường ống deploy ·
 * seed và script nạp bù · vòng đời client trong production · quiz.
 * Output CHẠY THẬT Prisma 6.x + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fprisma-orm%2Flearn&reflabel=Prisma';

export default {
  title: 'Chapter 11 — Shipping to production|||Chương 11 — Đưa lên production',
  description: 'Từ máy của bạn ra máy chủ thật: engine Rust đi kèm ảnh Docker và vì sao musl với glibc giết cả API, Dockerfile nhiều tầng chạy generate đúng chỗ, thứ tự chạy migration trong deploy để lược đồ không lệch nhịp với ảnh, seed và script nạp bù chạy được nhiều lần mà không hỏng, và vòng đời của PrismaClient khi có SIGTERM.',
  lessons: [
    /* ─────────────────────────── 11.1 ─────────────────────────── */
    {
      title: '11.1 — The engine in the image, and the seven-minute outage|||11.1 — Engine nằm trong ảnh, và bảy phút API chết',
      slug: 'pr-11-1-engine-trong-anh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Prisma đóng gói một engine Rust theo từng nền: musl với glibc là hai file khác nhau, binaryTargets quyết định file nào vào ảnh, và một lần dựng ảnh sai nền đã làm API CuongThai chết 502 bảy phút dù build xanh, đẩy xanh, tráo xanh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>The engine in the image, and the seven-minute outage</h2>
<p class="lead">Prisma Client is not pure JavaScript. It loads a compiled Rust binary, built for one specific combination of libc, CPU architecture and OpenSSL version. Get that combination wrong and nothing fails until the container starts — which is after the build passed, after the push passed, and after the old container was already replaced.</p>

<h3>What <code>prisma generate</code> actually puts on disk</h3>
<pre><code>npx prisma generate
ls -la node_modules/.prisma/client/</code></pre>
<div class="out">index.js                                    1.2 MB   <span class="tok-comment">← the JS API</span>
index.d.ts                                  3.8 MB   <span class="tok-comment">← the types from Chapter 8</span>
schema.prisma                                 12 KB   <span class="tok-comment">← a copy, read at runtime</span>
libquery_engine-debian-openssl-3.0.x.so.node  18 MB   <span class="tok-comment">← the Rust engine</span></div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The engine speaks the wire protocol</span><span class="lz-lnote">It builds the SQL, manages the connection pool from Lesson 9.4, and handles the PostgreSQL protocol. The JavaScript layer is an API over it, which is why <code>PrismaClient</code> works identically across databases.</span></div>
  <div class="lz-layer"><span class="lz-lname">One file per platform</span><span class="lz-lnote">The name encodes it: <code>debian-openssl-3.0.x</code> means glibc plus OpenSSL 3. Alpine's <code>linux-musl-openssl-3.0.x</code> is a different binary, and an ARM Mac's <code>darwin-arm64</code> is a third.</span></div>
  <div class="lz-layer"><span class="lz-lname">Generated, not installed</span><span class="lz-lnote"><code>npm ci</code> alone does not produce it. Nothing in <code>node_modules/@prisma/client</code> works until <code>prisma generate</code> has run — which is why a Dockerfile that copies <code>node_modules</code> from the host ships a client with the host's engine.</span></div>
  <div class="lz-layer"><span class="lz-lname">18 MB, per target</span><span class="lz-lnote">Listing four <code>binaryTargets</code> puts four engines in the image. It works, and it costs 72 MB. List the one the runtime actually uses, plus <code>native</code> only if the same image is also used for local development.</span></div>
</div>

<h3>The failure, exactly as it looks</h3>
<pre><code><span class="tok-comment"># The image built on Debian, running on Alpine</span>
docker logs cuonghoangdev_backend --tail 20</code></pre>
<div class="out">PrismaClientInitializationError:
Unable to require(&#96;/app/node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node&#96;)
Error loading shared library ld-linux-x86-64.so.2: No such file or directory

    at new PrismaClient (/app/node_modules/@prisma/client/…)
    at Object.&lt;anonymous&gt; (/app/dist/lib/prisma.js:4:16)

node:internal/process/promises:288
            triggerUncaughtException(err, true);
[nodemon] app crashed</div>
<pre><code><span class="tok-comment"># And what the orchestrator does about it</span>
docker ps -a --filter name=backend</code></pre>
<div class="out">CONTAINER ID   STATUS
a3f9e21c4b7d   Restarting (1) 3 seconds ago</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Build</span><span class="lz-t">✅ green</span><span class="lz-d">TypeScript compiles, the image layers cache, <code>docker build</code> exits 0. Nothing loads the engine at build time.</span></div>
  <div class="lz-step"><span class="lz-k">Push</span><span class="lz-t">✅ green</span><span class="lz-d">The registry accepts any image. It does not run it.</span></div>
  <div class="lz-step"><span class="lz-k">Swap</span><span class="lz-t">✅ green</span><span class="lz-d">The old container stops, the new one starts. <code>docker compose up -d</code> returns success — starting is not running.</span></div>
  <div class="lz-step"><span class="lz-k">Runtime</span><span class="lz-t">❌ 502, on a loop</span><span class="lz-d">The first <code>new PrismaClient()</code> throws, the process exits, the restart policy starts it again. The API is down and the deploy log says it succeeded.</span></div>
</div>
<div class="note-ct">
<p><strong>CuongThai, 18/08/2026 — seven minutes of 502.</strong> The deploy script built with <code>docker build .</code>, which picks the default <code>Dockerfile</code> — <code>node:22-alpine</code>, musl — instead of the <code>Dockerfile.backend</code> that compose actually uses. The generated client carried the <code>debian-openssl-3.0.x</code> engine into a musl image. Green build, green push, green swap, then an infinite restart loop. The fix was two parts: pass <code>-f</code> explicitly when building outside compose, and add a <strong>libc-versus-engine check before the push</strong>. The lesson written down afterwards: <em>a green build does not mean a runnable image.</em></p>
</div>

<h3>Declaring the targets</h3>
<pre><code><span class="tok-comment">// schema.prisma — build on a Mac, run on Alpine</span>
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>native</code></span><span class="v">Whatever the machine running <code>generate</code> is. Keep it so local development works; it is not the one that matters in the image.</span></div>
  <div class="kv"><span class="k">Alpine → <code>linux-musl-openssl-3.0.x</code></span><span class="v">And <code>linux-musl-arm64-openssl-3.0.x</code> on ARM. Alpine 3.17 and later use OpenSSL 3; older Alpine needs the <code>-1.1.x</code> variant.</span></div>
  <div class="kv"><span class="k">Debian/Ubuntu slim → <code>debian-openssl-3.0.x</code></span><span class="v"><code>node:22-slim</code> is Debian bookworm, OpenSSL 3. <code>node:22</code> (the full image) is the same. Bullseye-based images need <code>-1.1.x</code>.</span></div>
  <div class="kv"><span class="k">ARM servers</span><span class="v">A Graviton or Ampere host needs <code>linux-arm64-openssl-3.0.x</code>. Building on an Apple Silicon Mac for an x86 VPS is the same mismatch in the other direction, and it produces the identical error.</span></div>
</div>
<pre><code><span class="tok-comment"># Find out what a running container actually is</span>
docker run --rm node:22-alpine sh -c 'ldd --version 2&gt;&amp;1 | head -1; openssl version'
docker run --rm node:22-slim  sh -c 'ldd --version 2&gt;&amp;1 | head -1; openssl version'</code></pre>
<div class="out">musl libc (x86_64) Version 1.2.5
OpenSSL 3.5.1 1 Jul 2025

ldd (Debian GLIBC 2.36-9+deb12u13) 2.36
OpenSSL 3.0.16 11 Feb 2025</div>

<h3>The check that would have caught it</h3>
<pre><code><span class="tok-comment">#!/usr/bin/env bash</span>
<span class="tok-comment"># scripts/kiem-engine.sh — chạy TRƯỚC khi đẩy ảnh lên registry</span>
set -euo pipefail
ANH="\$1"

<span class="tok-comment"># 1. Which libc is inside the image?</span>
if docker run --rm --entrypoint sh "\$ANH" -c 'ls /lib/ld-musl-*.so.1' &gt;/dev/null 2&gt;&amp;1; then
  LIBC=musl
else
  LIBC=glibc
fi

<span class="tok-comment"># 2. Which engine did generate put there?</span>
ENGINE=\$(docker run --rm --entrypoint sh "\$ANH" -c \\
  'ls /app/node_modules/.prisma/client/libquery_engine-*.so.node' | head -1)

<span class="tok-comment"># 3. Do they agree?</span>
case "\$LIBC:\$ENGINE" in
  musl:*musl*)     echo "✅ musl ↔ \$(basename \$ENGINE)" ;;
  glibc:*debian*)  echo "✅ glibc ↔ \$(basename \$ENGINE)" ;;
  glibc:*rhel*)    echo "✅ glibc ↔ \$(basename \$ENGINE)" ;;
  *) echo "❌ LECH: anh la \$LIBC, engine la \$(basename \$ENGINE)"; exit 1 ;;
esac

<span class="tok-comment"># 4. The only proof that counts: actually construct a client.</span>
docker run --rm --entrypoint node "\$ANH" \\
  -e "new (require('@prisma/client').PrismaClient)(); console.log('✅ engine nap duoc')"</code></pre>
<div class="out">✅ musl ↔ libquery_engine-linux-musl-openssl-3.0.x.so.node
✅ engine nap duoc</div>
<div class="callout ok">
<p><strong>Step 4 is the one that generalises.</strong> Constructing a <code>PrismaClient</code> inside the built image loads the engine, and it does so without a database — the connection is lazy. It catches the libc mismatch, a missing OpenSSL, a <code>node_modules</code> layer that did not copy, and an engine that was pruned by an over-eager cleanup step. One <code>docker run</code>, about 400 ms, and it turns a seven-minute outage into a failed deploy step.</p>
</div>
<div class="pitfall">
<p><strong>Bẫy — building the image outside compose picks the default <code>Dockerfile</code>.</strong> <code>docker build .</code> means <code>-f Dockerfile</code>, whatever <code>docker-compose.yml</code> says the service uses. If your repository has <code>Dockerfile</code>, <code>Dockerfile.backend</code> and <code>frontend/Dockerfile</code>, a script that omits <code>-f</code> builds a plausible-looking image from the wrong recipe. Always pass <code>-f</code> explicitly in deploy scripts, and read it from the same compose file the server runs.</p>
</div>

<h3>The engineless option</h3>
<pre><code><span class="tok-comment"># Generate a client with no engine binary at all</span>
npx prisma generate --no-engine</code></pre>
<div class="out">✔ Generated Prisma Client (v6.4.1, engine=none) in 178ms

node_modules/.prisma/client/  →  4.1 MB   (khong co .so.node)</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">What it is for</span><span class="lz-lnote">Prisma Accelerate and Data Proxy: the client speaks HTTP to a hosted service that owns the engine and the pool. The platform question from Lesson 9.4 — two hundred lambdas, one hundred connections — is what it exists to answer.</span></div>
  <div class="lz-layer"><span class="lz-lname">What you give up</span><span class="lz-lnote">A network hop per query, a vendor in the data path, and <code>$queryRaw</code> restrictions. For a container on a VPS with a database in the same datacentre, it adds latency and solves a problem you do not have.</span></div>
  <div class="lz-layer"><span class="lz-lname">The size argument is real but small</span><span class="lz-lnote">18 MB out of a Node image that is 180 MB compressed. Worth it on a serverless bundle with a 50 MB limit; irrelevant on a long-running container.</span></div>
  <div class="lz-layer"><span class="lz-lname">The new <code>prisma-client</code> generator</span><span class="lz-lnote">Prisma 6 ships a second generator that emits into your source tree instead of <code>node_modules/.prisma</code>, with ESM output. Same engine story — it changes where the JavaScript lands, not what the Rust binary needs.</span></div>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-schema-reference#binarytargets-options" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">Prisma — binaryTargets</span><span class="lc-sub">prisma.io/docs · Every valid target name, and how to pick one</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-prisma" target="_blank" rel="noopener"><span class="lc-ico">🚢</span><span class="lc-body"><span class="lc-title">Prisma — deployment overview</span><span class="lc-sub">prisma.io/docs · What has to happen at build time versus run time</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/more/under-the-hood/engines" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">Prisma — engines under the hood</span><span class="lc-sub">prisma.io/docs · library versus binary engineType, and what the engine does</span></span></a>
<a class="link-card" href="https://wiki.musl-libc.org/functional-differences-from-glibc.html" target="_blank" rel="noopener"><span class="lc-ico">🧬</span><span class="lc-body"><span class="lc-title">musl versus glibc</span><span class="lc-sub">wiki.musl-libc.org · Why a binary for one cannot load on the other</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">CuongThai course — Docker</span><span class="lc-sub">Base images, multi-stage builds, and why -f matters</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Reproduce the musl/glibc crash on purpose, then write the pre-push check that stops it</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Engine nằm trong ảnh, và bảy phút API chết</h2>
<p class="lead">Prisma Client KHÔNG phải JavaScript thuần. Nó nạp một tệp nhị phân Rust đã biên dịch, dựng cho ĐÚNG MỘT tổ hợp libc, kiến trúc CPU và phiên bản OpenSSL. Sai tổ hợp đó thì không có gì hỏng cho tới lúc container KHỞI ĐỘNG — tức là sau khi build đã qua, sau khi push đã qua, và sau khi container cũ đã bị thay mất rồi.</p>

<h3><code>prisma generate</code> THẬT SỰ đặt gì lên đĩa</h3>
<pre><code>npx prisma generate
ls -la node_modules/.prisma/client/</code></pre>
<div class="out">index.js                                    1,2 MB   <span class="tok-comment">← API JavaScript</span>
index.d.ts                                  3,8 MB   <span class="tok-comment">← bộ kiểu của Chương 8</span>
schema.prisma                                 12 KB   <span class="tok-comment">← một bản sao, đọc lúc chạy</span>
libquery_engine-debian-openssl-3.0.x.so.node  18 MB   <span class="tok-comment">← engine Rust</span></div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Engine nói giao thức đường dây</span><span class="lz-lnote">Nó dựng câu SQL, quản connection pool của Bài 9.4, và xử lý giao thức PostgreSQL. Tầng JavaScript chỉ là một API phủ lên trên nó — đó là lý do <code>PrismaClient</code> hoạt động y hệt nhau trên các cơ sở dữ liệu khác nhau.</span></div>
  <div class="lz-layer"><span class="lz-lname">MỖI nền một file</span><span class="lz-lnote">Cái tên nói hết: <code>debian-openssl-3.0.x</code> nghĩa là glibc cộng OpenSSL 3. Bản <code>linux-musl-openssl-3.0.x</code> của Alpine là một tệp nhị phân KHÁC, và <code>darwin-arm64</code> của Mac ARM là cái thứ ba.</span></div>
  <div class="lz-layer"><span class="lz-lname">Được SINH RA, không phải được CÀI</span><span class="lz-lnote">Chỉ <code>npm ci</code> thôi thì không tạo ra nó. Không thứ gì trong <code>node_modules/@prisma/client</code> chạy được cho tới khi <code>prisma generate</code> chạy — đó là lý do một Dockerfile copy <code>node_modules</code> từ máy chủ nhà sẽ mang theo engine của máy đó vào ảnh.</span></div>
  <div class="lz-layer"><span class="lz-lname">18 MB, cho MỖI target</span><span class="lz-lnote">Khai bốn <code>binaryTargets</code> là bốn engine nằm trong ảnh. Nó chạy, và nó tốn 72 MB. Hãy khai đúng cái mà runtime dùng, cộng <code>native</code> chỉ khi cùng ảnh đó còn dùng để phát triển tại máy.</span></div>
</div>

<h3>Cú hỏng, đúng như nó hiện ra</h3>
<pre><code><span class="tok-comment"># Ảnh dựng trên Debian, chạy trên Alpine</span>
docker logs cuonghoangdev_backend --tail 20</code></pre>
<div class="out">PrismaClientInitializationError:
Unable to require(&#96;/app/node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node&#96;)
Error loading shared library ld-linux-x86-64.so.2: No such file or directory

    at new PrismaClient (/app/node_modules/@prisma/client/…)
    at Object.&lt;anonymous&gt; (/app/dist/lib/prisma.js:4:16)

node:internal/process/promises:288
            triggerUncaughtException(err, true);
[nodemon] app crashed</div>
<pre><code><span class="tok-comment"># Và bộ điều phối làm gì với chuyện đó</span>
docker ps -a --filter name=backend</code></pre>
<div class="out">CONTAINER ID   STATUS
a3f9e21c4b7d   Restarting (1) 3 seconds ago</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Build</span><span class="lz-t">✅ xanh</span><span class="lz-d">TypeScript biên dịch xong, các tầng ảnh vào cache, <code>docker build</code> thoát mã 0. Không có gì NẠP engine lúc build cả.</span></div>
  <div class="lz-step"><span class="lz-k">Push</span><span class="lz-t">✅ xanh</span><span class="lz-d">Registry nhận mọi ảnh. Nó không CHẠY ảnh.</span></div>
  <div class="lz-step"><span class="lz-k">Tráo</span><span class="lz-t">✅ xanh</span><span class="lz-d">Container cũ dừng, cái mới khởi động. <code>docker compose up -d</code> trả về thành công — KHỞI ĐỘNG không phải là ĐANG CHẠY.</span></div>
  <div class="lz-step"><span class="lz-k">Lúc chạy</span><span class="lz-t">❌ 502, thành vòng lặp</span><span class="lz-d"><code>new PrismaClient()</code> đầu tiên ném lỗi, tiến trình thoát, chính sách khởi động lại bật nó lên lại. API chết, mà nhật ký deploy thì nói là thành công.</span></div>
</div>
<div class="note-ct">
<p><strong>CuongThai, 18/08/2026 — bảy phút lỗi 502.</strong> Script deploy dựng bằng <code>docker build .</code>, tức là lấy <code>Dockerfile</code> mặc định — <code>node:22-alpine</code>, musl — thay vì <code>Dockerfile.backend</code> mà compose thật sự dùng. Client được sinh ra mang engine <code>debian-openssl-3.0.x</code> chui vào một ảnh musl. Build xanh, đẩy xanh, tráo xanh, rồi vòng lặp khởi động lại vô tận. Cách vá gồm hai phần: truyền <code>-f</code> tường minh khi dựng ảnh ngoài compose, và thêm một <strong>chốt kiểm libc ↔ engine TRƯỚC KHI ĐẨY</strong>. Bài học ghi lại sau đó: <em>build xanh không có nghĩa là ảnh chạy được.</em></p>
</div>

<h3>Khai báo target</h3>
<pre><code><span class="tok-comment">// schema.prisma — dựng trên Mac, chạy trên Alpine</span>
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>native</code></span><span class="v">Là bất cứ nền nào của cái máy đang chạy <code>generate</code>. Giữ nó để phát triển tại máy chạy được; nó KHÔNG phải cái quan trọng trong ảnh.</span></div>
  <div class="kv"><span class="k">Alpine → <code>linux-musl-openssl-3.0.x</code></span><span class="v">Và <code>linux-musl-arm64-openssl-3.0.x</code> trên ARM. Alpine 3.17 trở lên dùng OpenSSL 3; Alpine cũ hơn cần biến thể <code>-1.1.x</code>.</span></div>
  <div class="kv"><span class="k">Debian/Ubuntu slim → <code>debian-openssl-3.0.x</code></span><span class="v"><code>node:22-slim</code> là Debian bookworm, OpenSSL 3. <code>node:22</code> (ảnh đầy đủ) cũng vậy. Ảnh nền bullseye thì cần <code>-1.1.x</code>.</span></div>
  <div class="kv"><span class="k">Máy chủ ARM</span><span class="v">Một máy Graviton hay Ampere cần <code>linux-arm64-openssl-3.0.x</code>. Dựng trên Mac Apple Silicon để chạy trên VPS x86 là ĐÚNG cú lệch đó theo chiều ngược lại, và nó cho ra y hệt một lỗi.</span></div>
</div>
<pre><code><span class="tok-comment"># Xem một container đang chạy THẬT SỰ là nền gì</span>
docker run --rm node:22-alpine sh -c 'ldd --version 2&gt;&amp;1 | head -1; openssl version'
docker run --rm node:22-slim  sh -c 'ldd --version 2&gt;&amp;1 | head -1; openssl version'</code></pre>
<div class="out">musl libc (x86_64) Version 1.2.5
OpenSSL 3.5.1 1 Jul 2025

ldd (Debian GLIBC 2.36-9+deb12u13) 2.36
OpenSSL 3.0.16 11 Feb 2025</div>

<h3>Chốt kiểm lẽ ra đã bắt được nó</h3>
<pre><code><span class="tok-comment">#!/usr/bin/env bash</span>
<span class="tok-comment"># scripts/kiem-engine.sh — chạy TRƯỚC khi đẩy ảnh lên registry</span>
set -euo pipefail
ANH="\$1"

<span class="tok-comment"># 1. Bên trong ảnh là libc nào?</span>
if docker run --rm --entrypoint sh "\$ANH" -c 'ls /lib/ld-musl-*.so.1' &gt;/dev/null 2&gt;&amp;1; then
  LIBC=musl
else
  LIBC=glibc
fi

<span class="tok-comment"># 2. generate đã đặt engine nào vào đó?</span>
ENGINE=\$(docker run --rm --entrypoint sh "\$ANH" -c \\
  'ls /app/node_modules/.prisma/client/libquery_engine-*.so.node' | head -1)

<span class="tok-comment"># 3. Hai cái có khớp nhau không?</span>
case "\$LIBC:\$ENGINE" in
  musl:*musl*)     echo "✅ musl ↔ \$(basename \$ENGINE)" ;;
  glibc:*debian*)  echo "✅ glibc ↔ \$(basename \$ENGINE)" ;;
  glibc:*rhel*)    echo "✅ glibc ↔ \$(basename \$ENGINE)" ;;
  *) echo "❌ LECH: anh la \$LIBC, engine la \$(basename \$ENGINE)"; exit 1 ;;
esac

<span class="tok-comment"># 4. Bằng chứng DUY NHẤT có giá trị: thật sự dựng một client.</span>
docker run --rm --entrypoint node "\$ANH" \\
  -e "new (require('@prisma/client').PrismaClient)(); console.log('✅ engine nap duoc')"</code></pre>
<div class="out">✅ musl ↔ libquery_engine-linux-musl-openssl-3.0.x.so.node
✅ engine nap duoc</div>
<div class="callout ok">
<p><strong>Bước 4 mới là bước TỔNG QUÁT ĐƯỢC.</strong> Dựng một <code>PrismaClient</code> bên trong ảnh đã build sẽ nạp engine, và nạp mà KHÔNG cần cơ sở dữ liệu — kết nối là lười. Nó bắt được cú lệch libc, một OpenSSL thiếu, một tầng <code>node_modules</code> không copy sang, và một engine bị một bước dọn dẹp quá hăng xoá mất. Một lệnh <code>docker run</code>, chừng 400 ms, và nó biến bảy phút chết API thành một bước deploy thất bại.</p>
</div>
<div class="pitfall">
<p><strong>Bẫy — dựng ảnh NGOÀI compose thì lấy <code>Dockerfile</code> MẶC ĐỊNH.</strong> <code>docker build .</code> nghĩa là <code>-f Dockerfile</code>, bất kể <code>docker-compose.yml</code> nói dịch vụ đó dùng file nào. Nếu kho của bạn có <code>Dockerfile</code>, <code>Dockerfile.backend</code> và <code>frontend/Dockerfile</code>, thì một script quên <code>-f</code> sẽ dựng ra một cái ảnh trông rất hợp lý từ CÔNG THỨC SAI. Luôn truyền <code>-f</code> tường minh trong script deploy, và đọc nó ra từ chính cái file compose mà máy chủ chạy.</p>
</div>

<h3>Lựa chọn KHÔNG engine</h3>
<pre><code><span class="tok-comment"># Sinh một client không kèm tệp nhị phân engine nào cả</span>
npx prisma generate --no-engine</code></pre>
<div class="out">✔ Generated Prisma Client (v6.4.1, engine=none) in 178ms

node_modules/.prisma/client/  →  4,1 MB   (khong co .so.node)</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nó dùng để làm gì</span><span class="lz-lnote">Prisma Accelerate và Data Proxy: client nói HTTP tới một dịch vụ được lưu trữ sẵn, dịch vụ đó SỞ HỮU engine và cái pool. Bài toán nền tảng của Bài 9.4 — hai trăm lambda, một trăm kết nối — chính là thứ nó sinh ra để trả lời.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cái bạn đánh đổi</span><span class="lz-lnote">Một bước nhảy mạng cho MỖI truy vấn, một nhà cung cấp nằm trên đường đi của dữ liệu, và những hạn chế với <code>$queryRaw</code>. Với một container trên VPS có cơ sở dữ liệu cùng trung tâm dữ liệu, nó thêm độ trễ để giải một bài toán bạn không có.</span></div>
  <div class="lz-layer"><span class="lz-lname">Lý lẽ về dung lượng là THẬT nhưng nhỏ</span><span class="lz-lnote">18 MB trên một ảnh Node nén lại đã 180 MB. Đáng với một gói serverless có trần 50 MB; không liên quan với một container chạy dài.</span></div>
  <div class="lz-layer"><span class="lz-lname">Generator <code>prisma-client</code> mới</span><span class="lz-lnote">Prisma 6 kèm một generator thứ hai, xuất mã vào chính cây nguồn của bạn thay vì <code>node_modules/.prisma</code>, và ra ESM. Câu chuyện engine vẫn y nguyên — nó đổi chỗ JavaScript rơi xuống, không đổi thứ tệp nhị phân Rust cần.</span></div>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-schema-reference#binarytargets-options" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">Prisma — binaryTargets</span><span class="lc-sub">prisma.io/docs · Mọi tên target hợp lệ, và cách chọn</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-prisma" target="_blank" rel="noopener"><span class="lc-ico">🚢</span><span class="lc-body"><span class="lc-title">Prisma — tổng quan triển khai</span><span class="lc-sub">prisma.io/docs · Cái gì phải xảy ra lúc build, cái gì lúc chạy</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/more/under-the-hood/engines" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">Prisma — engine ở bên dưới</span><span class="lc-sub">prisma.io/docs · engineType library đối lại binary, và engine làm gì</span></span></a>
<a class="link-card" href="https://wiki.musl-libc.org/functional-differences-from-glibc.html" target="_blank" rel="noopener"><span class="lc-ico">🧬</span><span class="lc-body"><span class="lc-title">musl đối lại glibc</span><span class="lc-sub">wiki.musl-libc.org · Vì sao tệp nhị phân của bên này không nạp được trên bên kia</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Docker</span><span class="lc-sub">Ảnh nền, build nhiều tầng, và vì sao cái cờ -f lại quan trọng</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Cố ý tái hiện cú sập musl/glibc, rồi viết chốt kiểm trước-khi-đẩy chặn nó</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 11.2 ─────────────────────────── */
    {
      title: '11.2 — A Dockerfile that generates in the right place|||11.2 — Dockerfile sinh mã đúng chỗ',
      slug: 'pr-11-2-dockerfile',
      type: 'LESSON',
      description: 'Vì sao schema.prisma phải được COPY TRƯỚC npm ci, vì sao generate phải chạy trong tầng có cùng nền với runtime, chuyện gì xảy ra khi --omit=dev cắt mất Prisma CLI, và một Dockerfile ba tầng có chú thích từng dòng kèm số dung lượng thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>A Dockerfile that generates in the right place</h2>
<p class="lead">Three rules decide whether a Prisma image works: the schema must be present before <code>npm ci</code>, <code>generate</code> must run on the same base as the runtime, and the CLI must still exist wherever you run migrations. Every Prisma Docker problem is one of those three, and this lesson writes a Dockerfile that gets all three right, with the reasoning next to each line.</p>

<h3>Rule 1 — the schema must exist before <code>npm ci</code></h3>
<pre><code><span class="tok-comment"># package.json</span>
"scripts": {
  "postinstall": "prisma generate"
}</code></pre>
<pre><code><span class="tok-comment"># The Dockerfile everyone writes first</span>
COPY package*.json ./
RUN npm ci                <span class="tok-comment"># ← postinstall runs prisma generate here</span>
COPY . .                  <span class="tok-comment"># ← schema.prisma arrives AFTER</span></code></pre>
<div class="out">#8 [4/9] RUN npm ci
#8 2.104 &gt; api-backend@1.0.0 postinstall
#8 2.104 &gt; prisma generate
#8 2.881
#8 2.881 Error: Could not find Prisma Schema that is required for this command.
#8 2.881 Checked following paths:
#8 2.881   schema.prisma: file not found
#8 2.881   prisma/schema.prisma: file not found
#8 ERROR: process "/bin/sh -c npm ci" did not complete successfully: exit code 1</div>
<pre><code><span class="tok-comment"># The fix: copy the schema with the manifests</span>
COPY package*.json ./
COPY prisma ./prisma          <span class="tok-comment"># ← before npm ci</span>
RUN npm ci
COPY . .</code></pre>
<div class="callout ok">
<p><strong>This ordering is also the right one for layer caching.</strong> <code>package-lock.json</code> and <code>prisma/</code> change far less often than <code>src/</code>, so the expensive <code>npm ci</code> layer stays cached across almost every commit. Copying the whole tree first would invalidate it on every source edit and turn a five-second rebuild into a ninety-second one.</p>
</div>

<h3>Rule 2 — generate on the base you will run on</h3>
<pre><code><span class="tok-comment"># ❌ The mismatch: build on slim, run on alpine</span>
FROM node:22-slim AS build
RUN npm ci &amp;&amp; npx prisma generate      <span class="tok-comment"># debian engine</span>

FROM node:22-alpine
COPY --from=build /app/node_modules ./node_modules   <span class="tok-comment"># musl runtime, debian engine</span></code></pre>
<div class="out">Error loading shared library ld-linux-x86-64.so.2: No such file or directory</div>
<pre><code><span class="tok-comment"># ✅ Same base everywhere</span>
FROM node:22-alpine AS deps
FROM node:22-alpine AS build
FROM node:22-alpine AS runtime</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">One base, three stages</span><span class="v">The simplest correct rule. If every stage says <code>node:22-alpine</code>, the engine generated in stage two loads in stage three, and Lesson 11.1's outage cannot happen.</span></div>
  <div class="kv"><span class="k">If the bases must differ</span><span class="v">Declare both in <code>binaryTargets</code> and accept the extra 18 MB. Building on <code>slim</code> for an <code>alpine</code> runtime is legitimate — cross-compiling for a different CPU architecture, for instance — but it must be deliberate and declared.</span></div>
  <div class="kv"><span class="k">Alpine needs OpenSSL present</span><span class="v"><code>RUN apk add --no-cache openssl</code>. Without it, older Prisma versions warn <code>Prisma failed to detect the libssl/openssl version to use</code> and fall back to a guess that may not load.</span></div>
  <div class="kv"><span class="k">Never <code>COPY node_modules</code> from the host</span><span class="v">Put it in <code>.dockerignore</code>. Copying it ships your laptop's engine — <code>darwin-arm64</code> — into a Linux image, which is the same failure with a more confusing error message.</span></div>
</div>

<h3>Rule 3 — the CLI disappears with <code>--omit=dev</code></h3>
<pre><code>RUN npm ci --omit=dev
RUN npx prisma migrate deploy</code></pre>
<div class="out">npm error could not determine executable to run
(prisma is a devDependency; --omit=dev removed it)</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Option A — keep <code>prisma</code> in <code>dependencies</code></span><span class="lz-lnote">Simplest, and about 12 MB. Do this when the runtime image itself runs <code>migrate deploy</code> — which is the common pattern for a single-container deploy on a VPS.</span></div>
  <div class="lz-layer"><span class="lz-lname">Option B — a separate migration stage</span><span class="lz-lnote">Keep the CLI in a stage that has dev dependencies, run <code>migrate deploy</code> from there in the deploy pipeline, and leave the runtime image lean. Better hygiene, one more moving part.</span></div>
  <div class="lz-layer"><span class="lz-lname">Option C — migrations in CI, not in the image</span><span class="lz-lnote">The deploy job runs <code>migrate deploy</code> against the production database before swapping containers. This is where the ordering question of Lesson 11.3 lives, and it is the one that caused a real outage.</span></div>
  <div class="lz-layer"><span class="lz-lname">Whatever you pick, pick once</span><span class="lz-lnote">Two places running <code>migrate deploy</code> concurrently — the container entrypoint and the CI job — race for the advisory lock. One wins, the other reports a lock timeout, and the deploy log becomes ambiguous about whether the schema is current.</span></div>
</div>

<h3>The whole file, annotated</h3>
<pre><code><span class="tok-comment"># syntax=docker/dockerfile:1</span>

<span class="tok-comment"># ───── Stage 1: dependencies ─────────────────────────────────</span>
FROM node:22-alpine AS deps
RUN apk add --no-cache openssl                <span class="tok-comment"># Prisma engine needs libssl</span>
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma                          <span class="tok-comment"># Rule 1: schema before install</span>
RUN npm ci                                    <span class="tok-comment"># postinstall → prisma generate</span>

<span class="tok-comment"># ───── Stage 2: build ────────────────────────────────────────</span>
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate                       <span class="tok-comment"># schema may have changed with COPY . .</span>
RUN npm run build                             <span class="tok-comment"># tsc → dist/</span>
RUN npm prune --omit=dev                      <span class="tok-comment"># drop tsc, types, test tooling</span>

<span class="tok-comment"># ───── Stage 3: runtime ──────────────────────────────────────</span>
FROM node:22-alpine AS runtime
RUN apk add --no-cache openssl dumb-init
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules   <span class="tok-comment"># includes .prisma/client</span>
COPY --from=build /app/dist          ./dist
COPY --from=build /app/prisma        ./prisma        <span class="tok-comment"># migrations + schema, for deploy</span>
COPY package*.json ./

USER node                                     <span class="tok-comment"># do not run as root</span>
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]                <span class="tok-comment"># PID 1 that forwards SIGTERM — Bài 11.5</span>
CMD ["node", "dist/index.js"]</code></pre>
<div class="out">docker build -f Dockerfile.backend -t backend:test .

 =&gt; [deps  3/5] COPY prisma ./prisma                          0.0s
 =&gt; [deps  5/5] RUN npm ci                                   41.2s
 =&gt; [build 4/6] RUN npx prisma generate                       3.8s
 =&gt; [build 5/6] RUN npm run build                            18.4s
 =&gt; exporting layers                                          6.1s

docker images backend:test
REPOSITORY   TAG    SIZE
backend      test   412MB     (node:22-alpine 178MB + engine 18MB + deps + dist)</div>
<div class="pitfall">
<p><strong>Bẫy — <code>npm prune --omit=dev</code> runs after <code>generate</code>, and that order is not optional.</strong> Prune first and the CLI is gone before it can generate; generate first and the already-generated client in <code>node_modules/.prisma</code> survives the prune, because prune removes packages, not the generated output. Getting this backwards produces <code>@prisma/client did not initialize yet. Please run "prisma generate"</code> at container start — a message that sends people to re-run generate on their laptop, where it works fine.</p>
</div>

<h3>The <code>.dockerignore</code> that matters</h3>
<pre><code>node_modules          <span class="tok-comment"># Rule 2 — never ship the host's engine</span>
dist
.git
.env
.env.*
*.log
coverage
frontend              <span class="tok-comment"># the frontend has its own Dockerfile</span>

<span class="tok-comment"># DO NOT ignore prisma/ — the schema and migrations must be in the context</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k"><code>node_modules</code></span><span class="lz-t">Correctness, then speed</span><span class="lz-d">Excluding it prevents the wrong-engine bug and cuts the build context from hundreds of megabytes to a few — which is most of the "why is <code>docker build</code> slow before it starts" answer.</span></div>
  <div class="lz-step"><span class="lz-k"><code>.env</code></span><span class="lz-t">Security</span><span class="lz-d">A copied <code>.env</code> lives in an image layer forever, readable by anyone who pulls it, even if a later layer deletes the file. Runtime configuration is injected at run time.</span></div>
  <div class="lz-step"><span class="lz-k"><code>prisma/</code> stays</span><span class="lz-t">Required</span><span class="lz-d">Ignoring it is the fastest way to reproduce the Rule 1 error, and the error message blames <code>npm ci</code> rather than the ignore file.</span></div>
  <div class="lz-step"><span class="lz-k">Check it</span><span class="lz-t">One command</span><span class="lz-d"><code>docker build --no-cache --progress=plain . 2&gt;&amp;1 | grep 'transferring context'</code> tells you how big the context really is. A number in the hundreds of megabytes means something in this list is missing.</span></div>
</div>
<div class="note-ct">
<p><strong>Verify the image, do not trust the build.</strong> Lesson 11.1's step 4 belongs at the end of the build script: construct a <code>PrismaClient</code> inside the finished image. On CuongThai the deploy script now also checks libc against the engine name before pushing, because the 18/08/2026 outage went through a green build, a green push and a green swap. Two commands, under a second, and they cover the entire class of "the image is not runnable" failures that no compile step can see.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-to-a-different-os" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">Prisma — deploying to a different OS</span><span class="lc-sub">prisma.io/docs · Exactly the build-here-run-there case, with the target names</span></span></a>
<a class="link-card" href="https://github.com/prisma/prisma/tree/main/packages/client/tests/e2e/docker" target="_blank" rel="noopener"><span class="lc-ico">🐋</span><span class="lc-body"><span class="lc-title">Prisma's own Docker e2e setups</span><span class="lc-sub">github.com · Working Dockerfiles the Prisma team tests against</span></span></a>
<a class="link-card" href="https://docs.docker.com/build/building/multi-stage/" target="_blank" rel="noopener"><span class="lc-ico">🏗️</span><span class="lc-body"><span class="lc-title">Docker — multi-stage builds</span><span class="lc-sub">docs.docker.com · Stages, COPY --from, and what ends up in the final image</span></span></a>
<a class="link-card" href="https://github.com/Yelp/dumb-init" target="_blank" rel="noopener"><span class="lc-ico">🎛️</span><span class="lc-body"><span class="lc-title">dumb-init</span><span class="lc-sub">github.com · Why PID 1 in a container needs to forward signals</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">CuongThai course — Docker</span><span class="lc-sub">Layer caching, .dockerignore and image size, in depth</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Break each of the three rules in turn and read the error each one produces</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Dockerfile sinh mã đúng chỗ</h2>
<p class="lead">Ba luật quyết định một ảnh Prisma có chạy được hay không: schema phải có mặt TRƯỚC <code>npm ci</code>, <code>generate</code> phải chạy trên CÙNG nền với runtime, và CLI phải còn tồn tại ở nơi bạn chạy migration. Mọi trục trặc Prisma-trong-Docker đều là một trong ba cái đó, và bài này viết một Dockerfile làm đúng cả ba, kèm lý do đặt ngay cạnh từng dòng.</p>

<h3>Luật 1 — schema phải có TRƯỚC <code>npm ci</code></h3>
<pre><code><span class="tok-comment"># package.json</span>
"scripts": {
  "postinstall": "prisma generate"
}</code></pre>
<pre><code><span class="tok-comment"># Cái Dockerfile ai cũng viết đầu tiên</span>
COPY package*.json ./
RUN npm ci                <span class="tok-comment"># ← postinstall chạy prisma generate ở ĐÂY</span>
COPY . .                  <span class="tok-comment"># ← schema.prisma tới SAU</span></code></pre>
<div class="out">#8 [4/9] RUN npm ci
#8 2.104 &gt; api-backend@1.0.0 postinstall
#8 2.104 &gt; prisma generate
#8 2.881
#8 2.881 Error: Could not find Prisma Schema that is required for this command.
#8 2.881 Checked following paths:
#8 2.881   schema.prisma: file not found
#8 2.881   prisma/schema.prisma: file not found
#8 ERROR: process "/bin/sh -c npm ci" did not complete successfully: exit code 1</div>
<pre><code><span class="tok-comment"># Cách vá: copy schema cùng với các file kê khai</span>
COPY package*.json ./
COPY prisma ./prisma          <span class="tok-comment"># ← trước npm ci</span>
RUN npm ci
COPY . .</code></pre>
<div class="callout ok">
<p><strong>Thứ tự này cũng là thứ tự ĐÚNG cho cache tầng.</strong> <code>package-lock.json</code> và <code>prisma/</code> đổi ít hơn <code>src/</code> rất nhiều, nên cái tầng <code>npm ci</code> đắt đỏ nằm yên trong cache qua gần như mọi commit. Copy cả cây trước sẽ vô hiệu hoá nó ở MỖI lần sửa mã nguồn, biến một lần dựng lại năm giây thành chín mươi giây.</p>
</div>

<h3>Luật 2 — generate trên đúng cái nền bạn sẽ CHẠY</h3>
<pre><code><span class="tok-comment"># ❌ Cú lệch: dựng trên slim, chạy trên alpine</span>
FROM node:22-slim AS build
RUN npm ci &amp;&amp; npx prisma generate      <span class="tok-comment"># engine debian</span>

FROM node:22-alpine
COPY --from=build /app/node_modules ./node_modules   <span class="tok-comment"># runtime musl, engine debian</span></code></pre>
<div class="out">Error loading shared library ld-linux-x86-64.so.2: No such file or directory</div>
<pre><code><span class="tok-comment"># ✅ Cùng một nền ở mọi tầng</span>
FROM node:22-alpine AS deps
FROM node:22-alpine AS build
FROM node:22-alpine AS runtime</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Một nền, ba tầng</span><span class="v">Luật đúng đơn giản nhất. Nếu mọi tầng đều ghi <code>node:22-alpine</code> thì engine sinh ra ở tầng hai nạp được ở tầng ba, và cú sập của Bài 11.1 KHÔNG thể xảy ra.</span></div>
  <div class="kv"><span class="k">Nếu buộc phải khác nền</span><span class="v">Khai CẢ HAI trong <code>binaryTargets</code> và chấp nhận thêm 18 MB. Dựng trên <code>slim</code> cho runtime <code>alpine</code> là chính đáng — ví dụ khi biên dịch chéo cho kiến trúc CPU khác — nhưng nó phải là CÓ CHỦ Ý và được khai báo.</span></div>
  <div class="kv"><span class="k">Alpine cần có OpenSSL</span><span class="v"><code>RUN apk add --no-cache openssl</code>. Thiếu nó, các bản Prisma cũ hơn cảnh báo <code>Prisma failed to detect the libssl/openssl version to use</code> rồi lùi về một phỏng đoán có thể không nạp được.</span></div>
  <div class="kv"><span class="k">ĐỪNG BAO GIỜ <code>COPY node_modules</code> từ máy nhà</span><span class="v">Cho nó vào <code>.dockerignore</code>. Copy nó là đem engine của laptop bạn — <code>darwin-arm64</code> — vào một ảnh Linux, tức cùng một cú hỏng nhưng với thông báo lỗi khó hiểu hơn.</span></div>
</div>

<h3>Luật 3 — CLI biến mất cùng <code>--omit=dev</code></h3>
<pre><code>RUN npm ci --omit=dev
RUN npx prisma migrate deploy</code></pre>
<div class="out">npm error could not determine executable to run
(prisma la devDependency; --omit=dev da go no di)</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Lối A — giữ <code>prisma</code> trong <code>dependencies</code></span><span class="lz-lnote">Đơn giản nhất, tốn chừng 12 MB. Chọn nó khi chính ảnh runtime chạy <code>migrate deploy</code> — mẫu phổ biến với một triển khai một-container trên VPS.</span></div>
  <div class="lz-layer"><span class="lz-lname">Lối B — một tầng migration riêng</span><span class="lz-lnote">Giữ CLI trong một tầng CÓ dev dependency, chạy <code>migrate deploy</code> từ đó trong đường ống deploy, và để ảnh runtime gọn nhẹ. Vệ sinh hơn, thêm một bộ phận chuyển động.</span></div>
  <div class="lz-layer"><span class="lz-lname">Lối C — migration ở CI, không nằm trong ảnh</span><span class="lz-lnote">Job deploy chạy <code>migrate deploy</code> lên cơ sở dữ liệu production TRƯỚC khi tráo container. Đây là chỗ câu hỏi về THỨ TỰ của Bài 11.3 sinh sống, và nó từng gây một sự cố có thật.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chọn cái nào cũng được, nhưng chọn MỘT</span><span class="lz-lnote">Hai chỗ cùng chạy <code>migrate deploy</code> song song — entrypoint của container và job CI — sẽ tranh nhau cái advisory lock. Một bên thắng, bên kia báo hết giờ chờ khoá, và nhật ký deploy trở nên mập mờ về việc lược đồ đã mới hay chưa.</span></div>
</div>

<h3>Toàn bộ file, có chú thích</h3>
<pre><code><span class="tok-comment"># syntax=docker/dockerfile:1</span>

<span class="tok-comment"># ───── Tầng 1: phụ thuộc ─────────────────────────────────────</span>
FROM node:22-alpine AS deps
RUN apk add --no-cache openssl                <span class="tok-comment"># engine Prisma cần libssl</span>
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma                          <span class="tok-comment"># Luật 1: schema trước khi cài</span>
RUN npm ci                                    <span class="tok-comment"># postinstall → prisma generate</span>

<span class="tok-comment"># ───── Tầng 2: dựng ──────────────────────────────────────────</span>
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate                       <span class="tok-comment"># schema có thể đã đổi sau COPY . .</span>
RUN npm run build                             <span class="tok-comment"># tsc → dist/</span>
RUN npm prune --omit=dev                      <span class="tok-comment"># bỏ tsc, types, đồ test</span>

<span class="tok-comment"># ───── Tầng 3: runtime ───────────────────────────────────────</span>
FROM node:22-alpine AS runtime
RUN apk add --no-cache openssl dumb-init
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules   <span class="tok-comment"># có kèm .prisma/client</span>
COPY --from=build /app/dist          ./dist
COPY --from=build /app/prisma        ./prisma        <span class="tok-comment"># migration + schema, cho deploy</span>
COPY package*.json ./

USER node                                     <span class="tok-comment"># đừng chạy bằng root</span>
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]                <span class="tok-comment"># PID 1 biết chuyển tiếp SIGTERM — Bài 11.5</span>
CMD ["node", "dist/index.js"]</code></pre>
<div class="out">docker build -f Dockerfile.backend -t backend:test .

 =&gt; [deps  3/5] COPY prisma ./prisma                          0.0s
 =&gt; [deps  5/5] RUN npm ci                                   41.2s
 =&gt; [build 4/6] RUN npx prisma generate                       3.8s
 =&gt; [build 5/6] RUN npm run build                            18.4s
 =&gt; exporting layers                                          6.1s

docker images backend:test
REPOSITORY   TAG    SIZE
backend      test   412MB     (node:22-alpine 178MB + engine 18MB + deps + dist)</div>
<div class="pitfall">
<p><strong>Bẫy — <code>npm prune --omit=dev</code> chạy SAU <code>generate</code>, và thứ tự đó KHÔNG tuỳ chọn.</strong> Prune trước thì CLI biến mất trước khi kịp sinh mã; generate trước thì client đã sinh nằm trong <code>node_modules/.prisma</code> SỐNG SÓT qua lần prune, vì prune gỡ GÓI chứ không gỡ đầu ra đã sinh. Làm ngược thứ tự sẽ cho ra <code>@prisma/client did not initialize yet. Please run "prisma generate"</code> ngay lúc container khởi động — một thông báo đẩy người ta đi chạy lại generate trên laptop, nơi mọi thứ vẫn ổn.</p>
</div>

<h3><code>.dockerignore</code> quan trọng</h3>
<pre><code>node_modules          <span class="tok-comment"># Luật 2 — đừng bao giờ đem engine của máy nhà đi</span>
dist
.git
.env
.env.*
*.log
coverage
frontend              <span class="tok-comment"># frontend có Dockerfile riêng</span>

<span class="tok-comment"># ĐỪNG bỏ qua prisma/ — schema và migration PHẢI nằm trong ngữ cảnh build</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k"><code>node_modules</code></span><span class="lz-t">Đúng trước, nhanh sau</span><span class="lz-d">Loại nó ra vừa chặn được con bug sai-engine vừa cắt ngữ cảnh build từ hàng trăm megabyte xuống vài megabyte — và đó là phần lớn câu trả lời cho "vì sao <code>docker build</code> chậm ngay từ trước khi bắt đầu".</span></div>
  <div class="lz-step"><span class="lz-k"><code>.env</code></span><span class="lz-t">Bảo mật</span><span class="lz-d">Một file <code>.env</code> lỡ copy vào sẽ nằm trong một tầng ảnh VĨNH VIỄN, ai kéo ảnh về cũng đọc được, kể cả khi một tầng sau đó đã xoá file. Cấu hình lúc chạy thì tiêm vào lúc chạy.</span></div>
  <div class="lz-step"><span class="lz-k"><code>prisma/</code> phải ở lại</span><span class="lz-t">Bắt buộc</span><span class="lz-d">Bỏ qua nó là cách nhanh nhất để tái hiện lỗi Luật 1, và thông báo lỗi lại đổ tại <code>npm ci</code> chứ không nhắc gì tới file ignore.</span></div>
  <div class="lz-step"><span class="lz-k">Kiểm lại nó</span><span class="lz-t">Một câu lệnh</span><span class="lz-d"><code>docker build --no-cache --progress=plain . 2&gt;&amp;1 | grep 'transferring context'</code> cho bạn biết ngữ cảnh THẬT lớn cỡ nào. Một con số hàng trăm megabyte nghĩa là thiếu thứ gì đó trong danh sách này.</span></div>
</div>
<div class="note-ct">
<p><strong>Hãy XÁC MINH cái ảnh, đừng tin cái bản dựng.</strong> Bước 4 của Bài 11.1 thuộc về cuối script build: dựng một <code>PrismaClient</code> bên trong ảnh đã hoàn tất. Trên CuongThai, script deploy nay còn kiểm libc với tên engine trước khi đẩy, bởi vì sự cố 18/08/2026 đã đi lọt qua một bản dựng xanh, một lần đẩy xanh và một lần tráo xanh. Hai câu lệnh, dưới một giây, và chúng phủ trọn cái lớp lỗi "ảnh này không chạy được" mà không bước biên dịch nào nhìn thấy.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-to-a-different-os" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">Prisma — triển khai sang hệ điều hành khác</span><span class="lc-sub">prisma.io/docs · Đúng trường hợp dựng-ở-đây-chạy-ở-kia, kèm tên target</span></span></a>
<a class="link-card" href="https://github.com/prisma/prisma/tree/main/packages/client/tests/e2e/docker" target="_blank" rel="noopener"><span class="lc-ico">🐋</span><span class="lc-body"><span class="lc-title">Bộ e2e Docker của chính Prisma</span><span class="lc-sub">github.com · Những Dockerfile chạy được mà đội Prisma kiểm thử với chúng</span></span></a>
<a class="link-card" href="https://docs.docker.com/build/building/multi-stage/" target="_blank" rel="noopener"><span class="lc-ico">🏗️</span><span class="lc-body"><span class="lc-title">Docker — build nhiều tầng</span><span class="lc-sub">docs.docker.com · Tầng, COPY --from, và cái gì rơi vào ảnh cuối</span></span></a>
<a class="link-card" href="https://github.com/Yelp/dumb-init" target="_blank" rel="noopener"><span class="lc-ico">🎛️</span><span class="lc-body"><span class="lc-title">dumb-init</span><span class="lc-sub">github.com · Vì sao PID 1 trong container cần chuyển tiếp tín hiệu</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Docker</span><span class="lc-sub">Cache tầng, .dockerignore và dung lượng ảnh, nói kỹ</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Phá lần lượt từng luật trong ba luật rồi đọc lỗi mà mỗi cái tạo ra</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 11.3 ─────────────────────────── */
    {
      title: '11.3 — Migrations in the deploy, and the window where both versions run|||11.3 — Migration trong lúc deploy, và cái cửa sổ hai phiên bản cùng chạy',
      slug: 'pr-11-3-migration-khi-deploy',
      type: 'LESSON',
      description: 'Trong lúc tráo container, mã CŨ và lược đồ MỚI cùng sống một lúc — luật hai chiều rút ra từ đó, mẫu mở-rộng-rồi-thu-hẹp để đổi tên cột qua ba lần deploy, lock_timeout để một ALTER TABLE không xếp hàng cả website, và vì sao CREATE INDEX CONCURRENTLY không nằm trong migration được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Migrations in the deploy, and the window where both versions run</h2>
<p class="lead">A deploy is not atomic. For somewhere between two seconds and two minutes, the old container is still serving requests and the new schema is already applied — or the reverse. Every rule in this lesson follows from that one fact, and the outage it caused on this codebase is a good illustration of what happens when you design for the instant instead of the window.</p>

<h3>The two-way rule</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">t0</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Old code · old schema</span><span class="lz-nsub">Steady state before the deploy</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">t1 — the window</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Old code · NEW schema</span><span class="lz-nsub">Migration applied, containers not swapped yet</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">or NEW code · old schema</span><span class="lz-nsub">If you swap first, or if you roll back</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">t2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">New code · new schema</span><span class="lz-nsub">Steady state after</span></div></div>
  </div>
</div>
<div class="callout ok">
<p><strong>The rule, in one sentence: a migration must be safe for the code that is already running, and the new code must be safe against the schema that is already there.</strong> Both directions, every deploy. If either half is false, you have a window of failing requests whose length is whatever your swap takes — and a rollback that cannot actually roll back, because reverting the code does not revert the database.</p>
</div>
<div class="note-ct">
<p><strong>CuongThai, 03/07/2026 — the feed returned 500 while the schema lagged the image.</strong> At the time both <code>deploy-ghcr.yml</code> and <code>backend-vps.yml</code> ran on every push to <code>main</code>, so two pipelines raced: one swapped the container, the other was still applying migrations. The new code queried a column the migration had not created yet. The fix was structural rather than clever — both workflows became <code>workflow_dispatch</code> only, and deploying became a script you run (<code>deploy-nha.sh</code>) instead of a side effect of pushing. <strong>Two things that can independently change production must not both be triggered by the same event.</strong></p>
</div>

<h3>Which order, then?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Migrate first, then swap — the default</span><span class="v">The window is "old code, new schema". Safe as long as every migration is backward-compatible with the running code, which the expand/contract pattern below guarantees. This is the right default and what <code>deploy-ghcr.yml</code> does.</span></div>
  <div class="kv"><span class="k">Swap first, then migrate</span><span class="v">The window is "new code, old schema" — new code querying columns that do not exist yet. Almost always worse: the failure is immediate and total rather than conditional on a code path.</span></div>
  <div class="kv"><span class="k">Never: both at once</span><span class="v">Two triggers on the same event, as above. Whichever finishes first decides which window you get, and it will not be the same one twice.</span></div>
  <div class="kv"><span class="k">Gate on <code>migrate status</code></span><span class="v"><code>npx prisma migrate status</code> exits non-zero when migrations are pending or failed. Run it before the swap and after the migrate step; it turns "is the schema current?" from an assumption into a check.</span></div>
</div>
<pre><code><span class="tok-comment"># The deploy step, in order, with the gate</span>
npx prisma migrate deploy
npx prisma migrate status          <span class="tok-comment"># must be clean before swapping</span>
docker compose -p cuonghoangdev up -d --no-build backend</code></pre>
<div class="out">7 migrations found in prisma/migrations
Applying migration &#96;20260823120000_them_cot_ho_ten&#96;
The following migration have been applied: 20260823120000_them_cot_ho_ten

Database schema is up to date!</div>

<h3>Expand and contract — renaming a column across three deploys</h3>
<pre><code><span class="tok-comment">// ❌ The one-step rename. Compiles, migrates, breaks the window.</span>
model User {
  hoTen String   <span class="tok-comment">// was: fullName</span>
}</code></pre>
<div class="out">-- Prisma sinh ra:
ALTER TABLE "User" DROP COLUMN "fullName";
ALTER TABLE "User" ADD COLUMN "hoTen" TEXT NOT NULL;

-- Ma CU van dang SELECT "fullName" → 42703 column does not exist
-- Va toan bo du lieu ho ten vua bi xoa.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Deploy 1</span><span class="lz-t">Expand</span><span class="lz-d">Add <code>hoTen String?</code> — nullable, no default needed. Migration adds the column; old code ignores it. New code <strong>writes both</strong> columns and <strong>reads <code>fullName</code></strong>. Safe in both directions.</span></div>
  <div class="lz-step"><span class="lz-k">Between</span><span class="lz-t">Backfill</span><span class="lz-d"><code>UPDATE "User" SET "hoTen" = "fullName" WHERE "hoTen" IS NULL</code> — in chunks, as Lesson 11.4 shows. Nothing depends on it finishing, so it can take an hour.</span></div>
  <div class="lz-step"><span class="lz-k">Deploy 2</span><span class="lz-t">Switch the read</span><span class="lz-d">New code <strong>reads <code>hoTen</code></strong>, still writes both. If you roll back to deploy 1's image, it still works — <code>fullName</code> is current because deploy 2 kept writing it.</span></div>
  <div class="lz-step"><span class="lz-k">Deploy 3</span><span class="lz-t">Contract</span><span class="lz-d">Stop writing <code>fullName</code>. One deploy later, when you are sure no rollback target still reads it, a migration drops the column and <code>hoTen</code> becomes <code>NOT NULL</code>.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — <code>@map</code> makes this free, and people forget it exists.</strong> If the change is only what the <em>Prisma field</em> is called, <code>hoTen String @map("fullName")</code> renames it in your code with an empty migration — no column moves, no window, no backfill. Three deploys are for changing the actual column. Check which one you are doing before writing any of this.</p>
</div>

<h3>The migrations that lock the table</h3>
<pre><code><span class="tok-comment">-- Looks instant. Is not.</span>
ALTER TABLE "SocialPost" ADD COLUMN "diem" INTEGER NOT NULL DEFAULT 0;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Adding a column with a constant default</span><span class="v">Instant since PostgreSQL 11 — the default is stored in the catalogue, no table rewrite. Safe on any size.</span></div>
  <div class="kv"><span class="k">Adding <code>NOT NULL</code> without a default</span><span class="v">Fails immediately if any row exists. Add it nullable, backfill, then <code>SET NOT NULL</code> — and that last step still scans the whole table under an <code>ACCESS EXCLUSIVE</code> lock.</span></div>
  <div class="kv"><span class="k">Changing a column type</span><span class="v">Rewrites the table and holds <code>ACCESS EXCLUSIVE</code> for the duration. On a million rows, that is a total outage measured in minutes. Add a new column instead and expand/contract.</span></div>
  <div class="kv"><span class="k">Adding a unique constraint</span><span class="v">Builds a unique index over existing data, blocking writes, and fails outright if duplicates exist. Check for duplicates first, in a query, before writing the migration.</span></div>
</div>
<pre><code><span class="tok-comment">-- The first two lines of any migration that touches a big table</span>
SET lock_timeout = '3s';
SET statement_timeout = '30s';

ALTER TABLE "SocialPost" ADD COLUMN "diem" INTEGER NOT NULL DEFAULT 0;</code></pre>
<div class="out">-- KHONG co lock_timeout:
--   ALTER TABLE cho lay ACCESS EXCLUSIVE
--   → mot truy van dang chay giu lock 40 giay
--   → ALTER xep hang, va MOI truy van moi xep hang SAU no
--   → ca website dung, 40 giay, vi mot lenh "tuc thi"

-- CO lock_timeout = '3s':
ERROR: canceling statement due to lock timeout
-- Migration that bai. Website khong sao. Chay lai luc vang.</div>
<div class="callout warn">
<p><strong>A queued <code>ALTER TABLE</code> blocks everything behind it, including plain <code>SELECT</code>s.</strong> This is the detail that makes lock waits so much worse than they sound: the <code>ALTER</code> waits politely for the lock, but every query that arrives after it queues behind the <code>ALTER</code>, not behind the original holder. One slow report and one "instant" migration produce a full outage. <code>lock_timeout</code> turns that into a failed migration, which is a far better outcome — and it is two lines.</p>
</div>

<h3><code>CREATE INDEX CONCURRENTLY</code> and the transaction</h3>
<pre><code><span class="tok-comment">-- prisma/migrations/…/migration.sql</span>
CREATE INDEX CONCURRENTLY "socialpost_author_created_idx"
  ON "SocialPost" ("authorId", "createdAt" DESC);</code></pre>
<div class="out">Error: ERROR: CREATE INDEX CONCURRENTLY cannot run inside a transaction block

(Prisma ap dung MOI file migration ben trong mot giao dich tren PostgreSQL,
 nen ca file khong the chua CONCURRENTLY.)</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">On a small table — just take the lock</span><span class="lz-lnote">A plain <code>CREATE INDEX</code> on a few hundred thousand rows finishes in under a second and blocks writes for that long. Below roughly a million rows this is the simple, honest answer, and it keeps the index in migration history where it belongs.</span></div>
  <div class="lz-layer"><span class="lz-lname">On a large table — out of band, deliberately</span><span class="lz-lnote">Run the <code>CONCURRENTLY</code> statement by hand against production, verify it with <code>\\d+</code>, then add the matching migration and mark it applied. That is a <em>planned</em> use of <code>migrate resolve --applied</code>, written in the runbook beforehand — the opposite of auto-resolving a migration that failed, which hides a partially-applied change.</span></div>
  <div class="lz-layer"><span class="lz-lname">Never leave the index only in production</span><span class="lz-lnote">An index that exists on the server but not in <code>prisma/migrations/</code> is drift. Every fresh environment — CI, a new developer, a restored staging database — gets a different query plan from production, and the difference surfaces as "it is only slow on prod".</span></div>
  <div class="lz-layer"><span class="lz-lname">Check for drift, always</span><span class="lz-lnote"><code>npx prisma migrate diff --from-migrations ./prisma/migrations --to-database-url "$DATABASE_URL" --script</code>. Empty output means the migration history and the live database agree. Anything else is a list of the differences, and it is much better to read it now than during an incident.</span></div>
</div>
<div class="note-ct">
<p><strong>Why <code>migrate dev</code> is not part of any of this.</strong> <code>migrate dev</code> needs a shadow database and may reset it; it belongs on a developer's machine and nowhere else. On this codebase it does not even run locally: migration <code>20260706130000_add_music_and_profile</code> creates a unique constraint and a plain index with the same name, so replaying it on a shadow database fails with <code>P3006</code> forever. Migrations here are hand-written SQL under <code>prisma/migrations/&lt;timestamp&gt;_&lt;name&gt;/migration.sql</code> and applied with <code>migrate deploy</code>, which takes no shadow database — a constraint that turned out to enforce good habits.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/team-development" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Prisma — migrate deploy in CI/CD</span><span class="lc-sub">prisma.io/docs · Where the migrate step belongs in a pipeline</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/data-migration" target="_blank" rel="noopener"><span class="lc-ico">🔀</span><span class="lc-body"><span class="lc-title">Prisma — expand and contract</span><span class="lc-sub">prisma.io/docs · The multi-deploy pattern, written up officially</span></span></a>
<a class="link-card" href="https://github.com/ankane/strong_migrations#checks" target="_blank" rel="noopener"><span class="lc-ico">🚧</span><span class="lc-body"><span class="lc-title">strong_migrations — the unsafe list</span><span class="lc-sub">github.com · The canonical catalogue of migrations that lock, and their safe rewrites</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/explicit-locking.html" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">PostgreSQL — explicit locking</span><span class="lc-sub">postgresql.org · The lock modes, and which DDL takes which</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL</span><span class="lc-sub">Locks, DDL and the queue behind a waiting ALTER, from the database side</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Plan a column rename as three deploys, then prove each step survives a rollback</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Migration trong lúc deploy, và cái cửa sổ hai phiên bản cùng chạy</h2>
<p class="lead">Một lần deploy KHÔNG nguyên tử. Trong khoảng từ hai giây tới hai phút, container CŨ vẫn đang phục vụ request còn lược đồ MỚI thì đã áp xong — hoặc ngược lại. Mọi luật trong bài này đều suy ra từ đúng một sự thật đó, và cái sự cố nó gây ra trên chính kho mã này là một minh hoạ tốt cho chuyện gì xảy ra khi bạn thiết kế cho một KHOẢNH KHẮC thay vì cho một CỬA SỔ.</p>

<h3>Luật hai chiều</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">t0</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Mã cũ · lược đồ cũ</span><span class="lz-nsub">Trạng thái ổn định trước khi deploy</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">t1 — cửa sổ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Mã CŨ · lược đồ MỚI</span><span class="lz-nsub">Migration đã áp, container chưa tráo</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">hoặc mã MỚI · lược đồ CŨ</span><span class="lz-nsub">Nếu bạn tráo trước, hoặc nếu bạn lùi bản</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">t2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Mã mới · lược đồ mới</span><span class="lz-nsub">Trạng thái ổn định sau đó</span></div></div>
  </div>
</div>
<div class="callout ok">
<p><strong>Luật, gói trong một câu: một migration phải AN TOÀN với mã đang chạy sẵn, và mã mới phải AN TOÀN với lược đồ đang có sẵn.</strong> Cả hai chiều, ở MỌI lần deploy. Nếu một trong hai nửa sai, bạn có một cửa sổ request lỗi dài đúng bằng thời gian tráo container — và một cú lùi bản KHÔNG lùi được thật, vì lùi mã không lùi cơ sở dữ liệu.</p>
</div>
<div class="note-ct">
<p><strong>CuongThai, 03/07/2026 — feed trả 500 trong lúc lược đồ chạy sau cái ảnh.</strong> Hồi đó cả <code>deploy-ghcr.yml</code> lẫn <code>backend-vps.yml</code> đều chạy ở MỌI lần push vào <code>main</code>, nên hai đường ống đua nhau: một bên tráo container, bên kia vẫn đang áp migration. Mã mới truy vấn một cột mà migration chưa kịp tạo. Cách vá mang tính CẤU TRÚC chứ không phải khôn khéo — cả hai workflow chuyển sang chỉ <code>workflow_dispatch</code>, và deploy trở thành một script bạn CHẠY (<code>deploy-nha.sh</code>) thay vì một tác dụng phụ của việc push. <strong>Hai thứ có thể độc lập thay đổi production thì KHÔNG được cùng kích hoạt bởi một sự kiện.</strong></p>
</div>

<h3>Vậy thứ tự nào?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Migrate trước, tráo sau — mặc định</span><span class="v">Cửa sổ là "mã cũ, lược đồ mới". An toàn CHỪNG NÀO mọi migration còn tương thích ngược với mã đang chạy, điều mà mẫu mở-rộng-rồi-thu-hẹp bên dưới bảo đảm. Đây là mặc định ĐÚNG, và là thứ <code>deploy-ghcr.yml</code> làm.</span></div>
  <div class="kv"><span class="k">Tráo trước, migrate sau</span><span class="v">Cửa sổ là "mã mới, lược đồ cũ" — mã mới truy vấn những cột chưa tồn tại. Gần như luôn TỆ hơn: cú hỏng tức thì và toàn diện, chứ không phụ thuộc vào việc có ai đi vào đường mã đó hay không.</span></div>
  <div class="kv"><span class="k">Tuyệt đối không: cả hai cùng lúc</span><span class="v">Hai kích hoạt trên cùng một sự kiện, như ở trên. Bên nào xong trước sẽ quyết định bạn nhận cửa sổ nào, và nó sẽ không giống nhau hai lần.</span></div>
  <div class="kv"><span class="k">Chốt cửa bằng <code>migrate status</code></span><span class="v"><code>npx prisma migrate status</code> thoát với mã khác 0 khi còn migration chờ hoặc đã thất bại. Chạy nó trước khi tráo và sau bước migrate; nó biến "lược đồ đã mới chưa?" từ một giả định thành một PHÉP KIỂM.</span></div>
</div>
<pre><code><span class="tok-comment"># Bước deploy, theo thứ tự, có chốt cửa</span>
npx prisma migrate deploy
npx prisma migrate status          <span class="tok-comment"># phải sạch trước khi tráo</span>
docker compose -p cuonghoangdev up -d --no-build backend</code></pre>
<div class="out">7 migrations found in prisma/migrations
Applying migration &#96;20260823120000_them_cot_ho_ten&#96;
The following migration have been applied: 20260823120000_them_cot_ho_ten

Database schema is up to date!</div>

<h3>Mở rộng rồi thu hẹp — đổi tên một cột qua BA lần deploy</h3>
<pre><code><span class="tok-comment">// ❌ Đổi tên một phát. Biên dịch được, migrate được, vỡ ngay trong cửa sổ.</span>
model User {
  hoTen String   <span class="tok-comment">// trước là: fullName</span>
}</code></pre>
<div class="out">-- Prisma sinh ra:
ALTER TABLE "User" DROP COLUMN "fullName";
ALTER TABLE "User" ADD COLUMN "hoTen" TEXT NOT NULL;

-- Ma CU van dang SELECT "fullName" → 42703 column does not exist
-- Va toan bo du lieu ho ten vua bi xoa.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Deploy 1</span><span class="lz-t">Mở rộng</span><span class="lz-d">Thêm <code>hoTen String?</code> — cho phép null, không cần default. Migration thêm cột; mã cũ lờ nó đi. Mã mới <strong>GHI cả hai</strong> cột và <strong>ĐỌC <code>fullName</code></strong>. An toàn cả hai chiều.</span></div>
  <div class="lz-step"><span class="lz-k">Ở giữa</span><span class="lz-t">Nạp bù</span><span class="lz-d"><code>UPDATE "User" SET "hoTen" = "fullName" WHERE "hoTen" IS NULL</code> — chia lô, như Bài 11.4 chỉ. Không có gì phụ thuộc vào việc nó xong lúc nào, nên nó chạy cả tiếng cũng được.</span></div>
  <div class="lz-step"><span class="lz-k">Deploy 2</span><span class="lz-t">Chuyển đường ĐỌC</span><span class="lz-d">Mã mới <strong>ĐỌC <code>hoTen</code></strong>, vẫn ghi cả hai. Nếu bạn lùi về ảnh của deploy 1, nó vẫn chạy — <code>fullName</code> vẫn đúng vì deploy 2 vẫn ghi vào đó.</span></div>
  <div class="lz-step"><span class="lz-k">Deploy 3</span><span class="lz-t">Thu hẹp</span><span class="lz-d">Ngừng ghi <code>fullName</code>. Một lần deploy sau nữa, khi bạn chắc chắn không còn đích lùi bản nào còn đọc nó, một migration xoá cột đi và <code>hoTen</code> thành <code>NOT NULL</code>.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — <code>@map</code> làm việc này MIỄN PHÍ, mà người ta quên là nó tồn tại.</strong> Nếu thay đổi chỉ là cái <em>trường Prisma</em> tên là gì, thì <code>hoTen String @map("fullName")</code> đổi tên nó trong mã của bạn với một migration RỖNG — không cột nào dịch chuyển, không cửa sổ, không nạp bù. Ba lần deploy là dành cho việc đổi CỘT THẬT. Hãy xem mình đang làm cái nào trước khi viết bất cứ thứ gì ở trên.</p>
</div>

<h3>Những migration KHOÁ cả bảng</h3>
<pre><code><span class="tok-comment">-- Trông có vẻ tức thì. Không phải.</span>
ALTER TABLE "SocialPost" ADD COLUMN "diem" INTEGER NOT NULL DEFAULT 0;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Thêm cột kèm default là HẰNG</span><span class="v">Tức thì từ PostgreSQL 11 — default nằm trong catalogue, không viết lại bảng. An toàn ở mọi kích cỡ.</span></div>
  <div class="kv"><span class="k">Thêm <code>NOT NULL</code> mà KHÔNG có default</span><span class="v">Hỏng ngay nếu bảng có hàng nào. Hãy thêm cho phép null, nạp bù, rồi <code>SET NOT NULL</code> — và ngay cả bước cuối đó vẫn quét cả bảng dưới khoá <code>ACCESS EXCLUSIVE</code>.</span></div>
  <div class="kv"><span class="k">Đổi KIỂU của một cột</span><span class="v">Viết lại cả bảng và giữ <code>ACCESS EXCLUSIVE</code> suốt thời gian đó. Trên một triệu hàng, đó là một cú chết toàn phần đo bằng phút. Hãy thêm cột MỚI rồi mở-rộng-thu-hẹp.</span></div>
  <div class="kv"><span class="k">Thêm ràng buộc duy nhất</span><span class="v">Dựng một chỉ mục duy nhất trên dữ liệu đang có, chặn ghi, và hỏng hẳn nếu có trùng. Hãy kiểm trùng TRƯỚC bằng một câu truy vấn, trước khi viết migration.</span></div>
</div>
<pre><code><span class="tok-comment">-- Hai dòng đầu của MỌI migration đụng vào một bảng lớn</span>
SET lock_timeout = '3s';
SET statement_timeout = '30s';

ALTER TABLE "SocialPost" ADD COLUMN "diem" INTEGER NOT NULL DEFAULT 0;</code></pre>
<div class="out">-- KHONG co lock_timeout:
--   ALTER TABLE cho lay ACCESS EXCLUSIVE
--   → mot truy van dang chay giu lock 40 giay
--   → ALTER xep hang, va MOI truy van moi xep hang SAU no
--   → ca website dung, 40 giay, vi mot lenh "tuc thi"

-- CO lock_timeout = '3s':
ERROR: canceling statement due to lock timeout
-- Migration that bai. Website khong sao. Chay lai luc vang.</div>
<div class="callout warn">
<p><strong>Một <code>ALTER TABLE</code> đang xếp hàng sẽ CHẶN mọi thứ đứng sau nó, kể cả những câu <code>SELECT</code> thường.</strong> Đây là chi tiết làm cho việc chờ khoá tệ hơn nhiều so với vẻ ngoài của nó: cái <code>ALTER</code> chờ khoá một cách lịch sự, nhưng MỌI truy vấn tới sau nó lại xếp hàng SAU cái <code>ALTER</code>, chứ không phải sau kẻ đang giữ khoá ban đầu. Một báo cáo chạy chậm cộng một migration "tức thì" là ra một cú chết toàn phần. <code>lock_timeout</code> biến chuyện đó thành một migration thất bại, kết cục tốt hơn hẳn — và nó chỉ là hai dòng.</p>
</div>

<h3><code>CREATE INDEX CONCURRENTLY</code> và cái giao dịch</h3>
<pre><code><span class="tok-comment">-- prisma/migrations/…/migration.sql</span>
CREATE INDEX CONCURRENTLY "socialpost_author_created_idx"
  ON "SocialPost" ("authorId", "createdAt" DESC);</code></pre>
<div class="out">Error: ERROR: CREATE INDEX CONCURRENTLY cannot run inside a transaction block

(Prisma ap dung MOI file migration ben trong mot giao dich tren PostgreSQL,
 nen ca file khong the chua CONCURRENTLY.)</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Bảng nhỏ — cứ nhận lấy cái khoá</span><span class="lz-lnote">Một <code>CREATE INDEX</code> thường trên vài trăm nghìn hàng xong dưới một giây và chặn ghi đúng chừng đó. Dưới cỡ một triệu hàng, đây là câu trả lời đơn giản và trung thực, và nó giữ cái chỉ mục nằm trong lịch sử migration — đúng chỗ của nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bảng lớn — làm ngoài luồng, CÓ CHỦ Ý</span><span class="lz-lnote">Chạy câu <code>CONCURRENTLY</code> bằng tay lên production, xác minh bằng <code>\\d+</code>, rồi thêm migration tương ứng và đánh dấu là đã áp. Đó là một lần dùng <em>CÓ KẾ HOẠCH</em> của <code>migrate resolve --applied</code>, viết sẵn trong sổ tay vận hành — ngược hẳn với việc tự động resolve một migration ĐÃ THẤT BẠI, thứ che giấu một thay đổi áp dở dang.</span></div>
  <div class="lz-layer"><span class="lz-lname">ĐỪNG BAO GIỜ để chỉ mục chỉ tồn tại trên production</span><span class="lz-lnote">Một chỉ mục có trên máy chủ mà không có trong <code>prisma/migrations/</code> là TRÔI DẠT. Mọi môi trường mới — CI, một lập trình viên mới, một bản staging khôi phục từ sao lưu — sẽ nhận một kế hoạch truy vấn khác với production, và khác biệt đó hiện ra dưới dạng "chỉ chậm trên prod thôi".</span></div>
  <div class="lz-layer"><span class="lz-lname">Kiểm trôi dạt, luôn luôn</span><span class="lz-lnote"><code>npx prisma migrate diff --from-migrations ./prisma/migrations --to-database-url "$DATABASE_URL" --script</code>. Đầu ra rỗng nghĩa là lịch sử migration và cơ sở dữ liệu đang chạy khớp nhau. Bất cứ thứ gì khác là một danh sách khác biệt, và đọc nó BÂY GIỜ thì tốt hơn nhiều so với đọc lúc đang có sự cố.</span></div>
</div>
<div class="note-ct">
<p><strong>Vì sao <code>migrate dev</code> không dính gì tới tất cả những chuyện này.</strong> <code>migrate dev</code> cần một shadow database và có thể reset nó; nó thuộc về máy của lập trình viên và không thuộc về đâu khác. Trên kho mã này, nó thậm chí không chạy nổi ở máy: migration <code>20260706130000_add_music_and_profile</code> tạo một ràng buộc duy nhất và một chỉ mục thường TRÙNG TÊN, nên phát lại nó trên shadow database hỏng với <code>P3006</code> mãi mãi. Migration ở đây là SQL viết tay dưới <code>prisma/migrations/&lt;timestamp&gt;_&lt;tên&gt;/migration.sql</code> và áp bằng <code>migrate deploy</code>, thứ không cần shadow database — một ràng buộc hoá ra lại cưỡng chế những thói quen tốt.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/team-development" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Prisma — migrate deploy trong CI/CD</span><span class="lc-sub">prisma.io/docs · Bước migrate thuộc về chỗ nào trong một đường ống</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/data-migration" target="_blank" rel="noopener"><span class="lc-ico">🔀</span><span class="lc-body"><span class="lc-title">Prisma — mở rộng rồi thu hẹp</span><span class="lc-sub">prisma.io/docs · Mẫu nhiều-lần-deploy, được viết ra chính thức</span></span></a>
<a class="link-card" href="https://github.com/ankane/strong_migrations#checks" target="_blank" rel="noopener"><span class="lc-ico">🚧</span><span class="lc-body"><span class="lc-title">strong_migrations — danh sách không an toàn</span><span class="lc-sub">github.com · Danh mục kinh điển những migration gây khoá, kèm cách viết lại an toàn</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/explicit-locking.html" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">PostgreSQL — khoá tường minh</span><span class="lc-sub">postgresql.org · Các mức khoá, và lệnh DDL nào lấy mức nào</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL</span><span class="lc-sub">Khoá, DDL và cái hàng đợi phía sau một ALTER đang chờ, nhìn từ phía cơ sở dữ liệu</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Lên kế hoạch đổi tên một cột thành ba lần deploy, rồi chứng minh mỗi bước sống sót qua một cú lùi bản</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 11.4 ─────────────────────────── */
    {
      title: '11.4 — Seeds, data migrations and backfills are three different things|||11.4 — Seed, data migration và nạp bù là BA thứ khác nhau',
      slug: 'pr-11-4-seed-va-nap-bu',
      type: 'LESSON',
      description: 'Seed phải chạy lại được nên nó viết bằng upsert; data migration chạy một lần và phải ghi lại là đã chạy; script nạp bù chạy hàng giờ nên phải chia lô, nối lại được và có --dry-run. Kèm lý do tsc KHÔNG đụng tới prisma/** và cách bịt lỗ đó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>Seeds, data migrations and backfills are three different things</h2>
<p class="lead">All three are "a script that writes data", and treating them as one thing is how a seed wipes a production table. They differ in how often they run, what happens when they run twice, and how long they are allowed to take — and each of those differences dictates how the code is written.</p>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Seed</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Runs many times</span><span class="lz-nsub">Every fresh database, every CI run, after every reset</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Must be idempotent</span><span class="lz-nsub"><code>upsert</code> on a stable key, never bare <code>create</code></span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Data migration</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Runs exactly once</span><span class="lz-nsub">Tied to a schema change, recorded in migration history</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Fast, or it blocks the deploy</span><span class="lz-nsub">Seconds. Anything longer belongs in a backfill</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Backfill</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Runs for hours, out of band</span><span class="lz-nsub">Nothing waits for it; it can stop and resume</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chunked and resumable</span><span class="lz-nsub">Killed halfway, restarted, and it picks up where it stopped</span></div></div>
  </div>
</div>

<h3>The seed: <code>upsert</code>, and nothing else</h3>
<pre><code><span class="tok-comment">// package.json — this is where Prisma looks</span>
"prisma": {
  "seed": "tsx prisma/seed.ts"
}</code></pre>
<pre><code><span class="tok-comment">// ❌ Runs once. The second run is a P2002 or a duplicate row.</span>
await prisma.category.create({ data: { slug: 'databases', name: 'Cơ sở dữ liệu' } });

<span class="tok-comment">// ✅ Runs any number of times, converging on the same state</span>
await prisma.category.upsert({
  where:  { slug: 'databases' },
  update: { name: 'Cơ sở dữ liệu', sortOrder: 3 },   <span class="tok-comment">// keep it current too</span>
  create: { slug: 'databases', name: 'Cơ sở dữ liệu', sortOrder: 3 },
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">A stable natural key</span><span class="v"><code>slug</code>, <code>code</code>, <code>email</code> — something the seed itself decides. A generated <code>cuid</code> changes every run, so <code>upsert</code> on it always inserts and the seed is not idempotent after all.</span></div>
  <div class="kv"><span class="k"><code>update</code> is not optional</span><span class="v">Writing <code>update: {}</code> makes the seed a no-op on existing rows, so editing a name in the seed file never reaches an environment that already ran it. Put the real values in both halves.</span></div>
  <div class="kv"><span class="k">Reference data only</span><span class="v">Categories, roles, feature flags, the admin account. Not fake posts and not test users — a seed that runs in production must contain only things production should have.</span></div>
  <div class="kv"><span class="k">Guard the destructive parts</span><span class="v">If the seed also creates demo content, gate it: <code>if (process.env.SEED_DEMO === 'true')</code>. Never on <code>NODE_ENV !== 'production'</code> alone — a script run by hand often has no <code>NODE_ENV</code> at all, and the default is then "yes, create the demo data".</span></div>
</div>

<h3>Why <code>tsc --noEmit</code> does not check your seed</h3>
<pre><code><span class="tok-comment">// tsconfig.json</span>
{
  "compilerOptions": { "rootDir": "./src", "outDir": "./dist" },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "prisma"]     <span class="tok-comment">// ← the hole</span>
}</code></pre>
<div class="out">$ npx tsc --noEmit
$ echo $?
0                    ← prisma/seed.ts was never looked at</div>
<pre><code><span class="tok-comment">// prisma/seed.ts — the shape of the 08/08/2026 failure</span>
type ContentType = 'VLOG' | 'TUTORIAL' | 'CODE' | 'NEWS';   <span class="tok-comment">// hand-copied</span>

<span class="tok-comment">// The schema renamed CODE → CODE_REVIEW. This file type-checks</span>
<span class="tok-comment">// against its own copy of the union, so nothing complains —</span>
<span class="tok-comment">// until the seed runs against the real enum, on production.</span></code></pre>
<div class="out">PrismaClientKnownRequestError:
Invalid value for argument &#96;type&#96;. Expected ContentType.
  → invalid enum value: CODE</div>
<pre><code><span class="tok-comment">// ✅ Import the type. Then a schema rename is a compile error.</span>
import { ContentType } from '@prisma/client';

const loai: ContentType = ContentType.CODE_REVIEW;</code></pre>
<pre><code><span class="tok-comment">// tsconfig.seed.json — a second config for the excluded directory</span>
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "rootDir": ".", "noEmit": true },
  "include": ["prisma/**/*.ts"],
  "exclude": ["node_modules"]
}</code></pre>
<pre><code><span class="tok-comment">// package.json</span>
"typecheck:seed": "tsc -p tsconfig.seed.json --noEmit"</code></pre>
<div class="callout warn">
<p><strong>Type-checking the seed is necessary and still not sufficient.</strong> The only way to know a seed works is to run it. A missing relation, a unique constraint the data violates, a required field with no default — none of those are type errors. Whenever the schema changes, the checklist is all three: <code>npx tsc --noEmit</code>, <code>npm run typecheck:seed</code>, and <code>npx prisma db seed</code> against a real local database. The third one is the only one that would have caught 08/08.</p>
</div>
<div class="pitfall">
<p><strong>Bẫy — a hand-copied union type checks against itself.</strong> This is the general form, and it is not only about enums: a hand-written <code>interface</code> mirroring a Prisma model, a <code>type Role = 'ADMIN' | 'USER'</code> next to a Prisma enum, a duplicated list of column names. Each one is a copy that silently stops matching its original. Import from <code>@prisma/client</code>, always — Chapter 8 is thirty thousand characters on why the generated types are worth using.</p>
</div>

<h3>The data migration: once, and recorded</h3>
<pre><code><span class="tok-comment">-- prisma/migrations/20260823130000_chuan_hoa_email/migration.sql</span>
SET lock_timeout = '3s';

<span class="tok-comment">-- Schema change and data change, one migration, one transaction</span>
ALTER TABLE "User" ADD COLUMN "emailChuanHoa" TEXT;
UPDATE "User" SET "emailChuanHoa" = lower(trim(email));
CREATE UNIQUE INDEX "user_email_chuan_hoa_key" ON "User" ("emailChuanHoa");</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Why it belongs in the migration</span><span class="lz-lnote">The column and its contents arrive together, atomically, recorded in <code>_prisma_migrations</code>. Every environment gets it exactly once, in the right order relative to other schema changes, with no separate step to remember.</span></div>
  <div class="lz-layer"><span class="lz-lname">The size limit</span><span class="lz-lnote">That <code>UPDATE</code> touches every row inside the deploy's transaction. On ten thousand users it is instant; on ten million it holds a lock for minutes and the deploy is an outage. Above roughly a hundred thousand rows, split it: migration adds the nullable column, a backfill fills it, a later migration adds the constraint.</span></div>
  <div class="lz-layer"><span class="lz-lname">It must be idempotent-by-history, not by code</span><span class="lz-lnote">Prisma guarantees a migration runs once by recording it. Do not add <code>IF NOT EXISTS</code> defensive rewrites to "make it safe to re-run" — that hides a partially applied migration, which is the state you most need to see.</span></div>
  <div class="lz-layer"><span class="lz-lname">Test it against a copy</span><span class="lz-lnote">Restore a recent production dump locally and run <code>migrate deploy</code>. Real data has the duplicate emails, the NULLs and the 4,000-character bio that your development database does not, and those are what break data migrations.</span></div>
</div>

<h3>The backfill: chunked, resumable, dry-runnable</h3>
<pre><code><span class="tok-comment">// scripts/nap-bu-ho-ten.ts</span>
const LO = 1000;
const KHO = process.argv.includes('--that');   <span class="tok-comment">// default is a dry run</span>

let tong = 0;
for (;;) {
  <span class="tok-comment">// The un-backfilled rows ARE the queue. No cursor to store.</span>
  const canLam = await prisma.user.findMany({
    where:  { hoTen: null, fullName: { not: null } },
    select: { id: true, fullName: true },
    take:   LO,
  });
  if (canLam.length === 0) break;

  if (!KHO) {
    console.log(&#96;[thu] se cap nhat \${canLam.length} hang, vi du:&#96;, canLam[0]);
  } else {
    await prisma.$transaction(
      canLam.map((u) =&gt; prisma.user.update({
        where: { id: u.id }, data: { hoTen: u.fullName },
      })),
    );
  }

  tong += canLam.length;
  console.log(&#96;\${tong} hang · \${new Date().toISOString()}&#96;);
  if (!KHO) break;
  await new Promise((r) =&gt; setTimeout(r, 200));   <span class="tok-comment">// let the database breathe</span>
}</code></pre>
<div class="out">$ npx tsx scripts/nap-bu-ho-ten.ts
[thu] se cap nhat 1000 hang, vi du: { id: 'clx7…', fullName: 'Nguyen Van An' }
1000 hang · 2026-08-23T13:04:11.284Z

$ npx tsx scripts/nap-bu-ho-ten.ts --that
1000 hang · 2026-08-23T13:05:02.118Z
2000 hang · 2026-08-23T13:05:03.402Z
…
1247104 hang · 2026-08-23T13:41:55.907Z</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The filter is the cursor</span><span class="lz-t">Resumable for free</span><span class="lz-d"><code>where: { hoTen: null }</code> means completed rows leave the queue by definition. Kill the script at any point, run it again, and it continues — no checkpoint file, no offset to store, no double-processing.</span></div>
  <div class="lz-step"><span class="lz-k">Dry run by default</span><span class="lz-t">The flag is <code>--that</code>, not <code>--dry-run</code></span><span class="lz-d">Requiring a flag to write means a mistyped command does nothing. Requiring a flag to <em>not</em> write means a forgotten flag rewrites production. Default to safe.</span></div>
  <div class="lz-step"><span class="lz-k">Sleep between chunks</span><span class="lz-t">Leave headroom</span><span class="lz-d">200 ms per thousand rows keeps the backfill well under the connection budget from Lesson 9.4 and gives autovacuum room to keep up with the dead tuples the updates create.</span></div>
  <div class="lz-step"><span class="lz-k">Log a timestamp per chunk</span><span class="lz-t">So you can predict the end</span><span class="lz-d">Two lines of output give you a rate; a rate gives you an ETA. A backfill with no progress output is indistinguishable from a hung one, and someone will kill it at minute forty.</span></div>
</div>
<div class="note-ct">
<p><strong>Running one-off scripts against production, on this codebase.</strong> The container has the built client and the right engine, so the script runs there rather than from a laptop: <code>docker exec cuonghoangdev_backend node scripts/….js</code>. Two habits go with it. Background work is gated by environment — <code>LLM_BACKGROUND_ENABLED</code> defaults to <code>false</code> precisely so a forgotten variable cannot quietly generate content and bill for it every morning. And any script that writes gets its dry run read by a human first; the output above, listing the first row it would change, is the whole point of the pattern.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding" target="_blank" rel="noopener"><span class="lc-ico">🌱</span><span class="lc-body"><span class="lc-title">Prisma — seeding</span><span class="lc-sub">prisma.io/docs · The package.json entry, and when the seed runs by itself</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/data-migration" target="_blank" rel="noopener"><span class="lc-ico">📤</span><span class="lc-body"><span class="lc-title">Prisma — data migrations</span><span class="lc-sub">prisma.io/docs · Schema and data in one migration, and when to split them</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/transactions#batchbulk-operations" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">Prisma — batch operations</span><span class="lc-sub">prisma.io/docs · The array form of $transaction that each chunk uses</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/routine-vacuuming.html" target="_blank" rel="noopener"><span class="lc-ico">🧹</span><span class="lc-body"><span class="lc-title">PostgreSQL — routine vacuuming</span><span class="lc-sub">postgresql.org · Why a fast backfill leaves the table bloated, and what fixes it</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">CuongThai course — TypeScript</span><span class="lc-sub">tsconfig include, exclude and project references — the hole this lesson closes</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Turn a create-based seed into an idempotent one, then write a resumable backfill</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Seed, data migration và nạp bù là BA thứ khác nhau</h2>
<p class="lead">Cả ba đều là "một script ghi dữ liệu", và coi chúng là một thứ chính là cách một cái seed xoá sạch một bảng production. Chúng khác nhau ở chỗ chạy bao nhiêu lần, chuyện gì xảy ra khi chạy lần thứ hai, và được phép mất bao lâu — và mỗi khác biệt đó quy định luôn cách viết mã.</p>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Seed</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chạy NHIỀU lần</span><span class="lz-nsub">Mỗi cơ sở dữ liệu mới, mỗi lượt CI, sau mỗi lần reset</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">PHẢI luỹ đẳng</span><span class="lz-nsub"><code>upsert</code> trên một khoá ổn định, không bao giờ <code>create</code> trần</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Data migration</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chạy ĐÚNG một lần</span><span class="lz-nsub">Gắn với một thay đổi lược đồ, ghi vào lịch sử migration</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nhanh, không thì nó chặn deploy</span><span class="lz-nsub">Vài giây. Lâu hơn thì thuộc về một script nạp bù</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Nạp bù</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chạy hàng giờ, ngoài luồng</span><span class="lz-nsub">Không ai đợi nó; nó dừng rồi chạy tiếp được</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chia lô và nối lại được</span><span class="lz-nsub">Bị giết giữa chừng, chạy lại, và nó đi tiếp từ chỗ đã dừng</span></div></div>
  </div>
</div>

<h3>Seed: <code>upsert</code>, và không gì khác</h3>
<pre><code><span class="tok-comment">// package.json — đây là chỗ Prisma tìm</span>
"prisma": {
  "seed": "tsx prisma/seed.ts"
}</code></pre>
<pre><code><span class="tok-comment">// ❌ Chạy được MỘT lần. Lần hai là P2002 hoặc một hàng trùng.</span>
await prisma.category.create({ data: { slug: 'databases', name: 'Cơ sở dữ liệu' } });

<span class="tok-comment">// ✅ Chạy bao nhiêu lần cũng được, đều hội tụ về cùng một trạng thái</span>
await prisma.category.upsert({
  where:  { slug: 'databases' },
  update: { name: 'Cơ sở dữ liệu', sortOrder: 3 },   <span class="tok-comment">// cập nhật luôn cho mới</span>
  create: { slug: 'databases', name: 'Cơ sở dữ liệu', sortOrder: 3 },
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Một khoá tự nhiên ỔN ĐỊNH</span><span class="v"><code>slug</code>, <code>code</code>, <code>email</code> — thứ do chính cái seed quyết định. Một <code>cuid</code> sinh tự động thì đổi ở mỗi lần chạy, nên <code>upsert</code> theo nó luôn CHÈN, và rốt cuộc seed vẫn không luỹ đẳng.</span></div>
  <div class="kv"><span class="k"><code>update</code> KHÔNG phải tuỳ chọn</span><span class="v">Viết <code>update: {}</code> làm cho seed thành vô-tác-dụng trên những hàng đã có, nên sửa một cái tên trong file seed sẽ không bao giờ tới được môi trường đã chạy nó rồi. Hãy đặt giá trị THẬT vào cả hai nửa.</span></div>
  <div class="kv"><span class="k">Chỉ dữ liệu tham chiếu</span><span class="v">Danh mục, vai trò, cờ tính năng, tài khoản quản trị. KHÔNG phải bài viết giả và KHÔNG phải người dùng thử — một cái seed chạy trên production thì chỉ được chứa những thứ production nên có.</span></div>
  <div class="kv"><span class="k">Chốt cửa cho phần phá hoại</span><span class="v">Nếu seed còn tạo cả nội dung demo, hãy chốt lại: <code>if (process.env.SEED_DEMO === 'true')</code>. ĐỪNG chỉ chốt bằng <code>NODE_ENV !== 'production'</code> — một script chạy tay thường KHÔNG có <code>NODE_ENV</code> nào cả, và mặc định khi đó là "có, tạo dữ liệu demo đi".</span></div>
</div>

<h3>Vì sao <code>tsc --noEmit</code> KHÔNG kiểm cái seed của bạn</h3>
<pre><code><span class="tok-comment">// tsconfig.json</span>
{
  "compilerOptions": { "rootDir": "./src", "outDir": "./dist" },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "prisma"]     <span class="tok-comment">// ← cái lỗ</span>
}</code></pre>
<div class="out">$ npx tsc --noEmit
$ echo $?
0                    ← prisma/seed.ts chua he duoc nhin toi</div>
<pre><code><span class="tok-comment">// prisma/seed.ts — hình dạng của cú hỏng ngày 08/08/2026</span>
type ContentType = 'VLOG' | 'TUTORIAL' | 'CODE' | 'NEWS';   <span class="tok-comment">// chép tay</span>

<span class="tok-comment">// Lược đồ đã đổi CODE → CODE_REVIEW. File này tự kiểm kiểu</span>
<span class="tok-comment">// với chính bản sao union của nó, nên chẳng ai kêu ca gì —</span>
<span class="tok-comment">// cho tới khi seed chạy lên enum THẬT, trên production.</span></code></pre>
<div class="out">PrismaClientKnownRequestError:
Invalid value for argument &#96;type&#96;. Expected ContentType.
  → invalid enum value: CODE</div>
<pre><code><span class="tok-comment">// ✅ Import cái kiểu vào. Khi đó đổi tên trong lược đồ là LỖI BIÊN DỊCH.</span>
import { ContentType } from '@prisma/client';

const loai: ContentType = ContentType.CODE_REVIEW;</code></pre>
<pre><code><span class="tok-comment">// tsconfig.seed.json — một cấu hình thứ hai cho thư mục bị loại trừ</span>
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "rootDir": ".", "noEmit": true },
  "include": ["prisma/**/*.ts"],
  "exclude": ["node_modules"]
}</code></pre>
<pre><code><span class="tok-comment">// package.json</span>
"typecheck:seed": "tsc -p tsconfig.seed.json --noEmit"</code></pre>
<div class="callout warn">
<p><strong>Kiểm kiểu cái seed là CẦN, và vẫn CHƯA ĐỦ.</strong> Cách duy nhất để biết một cái seed chạy được là CHẠY nó. Một quan hệ thiếu, một ràng buộc duy nhất mà dữ liệu vi phạm, một trường bắt buộc không có default — không cái nào là lỗi kiểu cả. Mỗi khi lược đồ đổi, danh sách kiểm là đủ ba: <code>npx tsc --noEmit</code>, <code>npm run typecheck:seed</code>, và <code>npx prisma db seed</code> lên một cơ sở dữ liệu THẬT ở máy. Cái thứ ba là cái DUY NHẤT lẽ ra đã bắt được ngày 08/08.</p>
</div>
<div class="pitfall">
<p><strong>Bẫy — một union chép tay thì tự kiểm với chính nó.</strong> Đây là dạng TỔNG QUÁT, và không chỉ chuyện enum: một <code>interface</code> viết tay soi gương một model Prisma, một <code>type Role = 'ADMIN' | 'USER'</code> nằm cạnh một enum Prisma, một danh sách tên cột chép lại. Mỗi cái là một bản sao lặng lẽ ngừng khớp với bản gốc. Hãy import từ <code>@prisma/client</code>, luôn luôn — cả Chương 8 là ba mươi nghìn ký tự nói về lý do những kiểu được sinh ra kia đáng dùng.</p>
</div>

<h3>Data migration: một lần, và có ghi lại</h3>
<pre><code><span class="tok-comment">-- prisma/migrations/20260823130000_chuan_hoa_email/migration.sql</span>
SET lock_timeout = '3s';

<span class="tok-comment">-- Đổi lược đồ và đổi dữ liệu, một migration, một giao dịch</span>
ALTER TABLE "User" ADD COLUMN "emailChuanHoa" TEXT;
UPDATE "User" SET "emailChuanHoa" = lower(trim(email));
CREATE UNIQUE INDEX "user_email_chuan_hoa_key" ON "User" ("emailChuanHoa");</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Vì sao nó thuộc về migration</span><span class="lz-lnote">Cái cột và nội dung của nó tới CÙNG nhau, nguyên tử, được ghi vào <code>_prisma_migrations</code>. Mọi môi trường nhận nó đúng một lần, đúng thứ tự so với các thay đổi lược đồ khác, không có bước riêng nào phải nhớ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Giới hạn về kích cỡ</span><span class="lz-lnote">Cái <code>UPDATE</code> đó đụng MỌI hàng, bên trong giao dịch của lần deploy. Với mười nghìn người dùng thì tức thì; với mười triệu thì nó giữ khoá hàng phút và lần deploy thành một sự cố. Trên cỡ trăm nghìn hàng, hãy tách ra: migration thêm cột cho phép null, một script nạp bù điền vào, một migration sau nữa thêm ràng buộc.</span></div>
  <div class="lz-layer"><span class="lz-lname">Luỹ đẳng NHỜ LỊCH SỬ, không phải nhờ mã</span><span class="lz-lnote">Prisma bảo đảm một migration chạy một lần bằng cách GHI LẠI nó. Đừng thêm mấy kiểu viết lại phòng thủ <code>IF NOT EXISTS</code> để "cho chạy lại được an toàn" — cái đó che mất một migration áp dở dang, đúng cái trạng thái bạn cần nhìn thấy nhất.</span></div>
  <div class="lz-layer"><span class="lz-lname">Thử nó trên một BẢN SAO</span><span class="lz-lnote">Khôi phục một bản dump production gần đây xuống máy rồi chạy <code>migrate deploy</code>. Dữ liệu thật mới có mấy cái email trùng, mấy giá trị NULL và cái tiểu sử 4.000 ký tự mà cơ sở dữ liệu phát triển của bạn không có, và đó chính là những thứ làm vỡ data migration.</span></div>
</div>

<h3>Nạp bù: chia lô, nối lại được, chạy thử được</h3>
<pre><code><span class="tok-comment">// scripts/nap-bu-ho-ten.ts</span>
const LO = 1000;
const KHO = process.argv.includes('--that');   <span class="tok-comment">// mặc định là chạy THỬ</span>

let tong = 0;
for (;;) {
  <span class="tok-comment">// Những hàng CHƯA nạp bù CHÍNH LÀ hàng đợi. Không cần lưu con trỏ.</span>
  const canLam = await prisma.user.findMany({
    where:  { hoTen: null, fullName: { not: null } },
    select: { id: true, fullName: true },
    take:   LO,
  });
  if (canLam.length === 0) break;

  if (!KHO) {
    console.log(&#96;[thu] se cap nhat \${canLam.length} hang, vi du:&#96;, canLam[0]);
  } else {
    await prisma.$transaction(
      canLam.map((u) =&gt; prisma.user.update({
        where: { id: u.id }, data: { hoTen: u.fullName },
      })),
    );
  }

  tong += canLam.length;
  console.log(&#96;\${tong} hang · \${new Date().toISOString()}&#96;);
  if (!KHO) break;
  await new Promise((r) =&gt; setTimeout(r, 200));   <span class="tok-comment">// để cơ sở dữ liệu thở</span>
}</code></pre>
<div class="out">$ npx tsx scripts/nap-bu-ho-ten.ts
[thu] se cap nhat 1000 hang, vi du: { id: 'clx7…', fullName: 'Nguyen Van An' }
1000 hang · 2026-08-23T13:04:11.284Z

$ npx tsx scripts/nap-bu-ho-ten.ts --that
1000 hang · 2026-08-23T13:05:02.118Z
2000 hang · 2026-08-23T13:05:03.402Z
…
1247104 hang · 2026-08-23T13:41:55.907Z</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bộ lọc CHÍNH LÀ con trỏ</span><span class="lz-t">Nối lại được, miễn phí</span><span class="lz-d"><code>where: { hoTen: null }</code> nghĩa là hàng đã xong thì tự rời khỏi hàng đợi theo định nghĩa. Giết script ở bất cứ đâu, chạy lại, và nó đi tiếp — không file điểm dừng, không offset phải lưu, không xử lý trùng.</span></div>
  <div class="lz-step"><span class="lz-k">Mặc định là chạy THỬ</span><span class="lz-t">Cờ là <code>--that</code>, không phải <code>--dry-run</code></span><span class="lz-d">Bắt phải có cờ mới GHI nghĩa là một câu lệnh gõ nhầm chẳng làm gì. Bắt phải có cờ mới KHÔNG ghi nghĩa là một cái cờ quên mất sẽ ghi đè production. Hãy mặc định về phía an toàn.</span></div>
  <div class="lz-step"><span class="lz-k">Ngủ giữa các lô</span><span class="lz-t">Chừa khoảng thở</span><span class="lz-d">200 ms cho mỗi nghìn hàng giữ cho việc nạp bù nằm sâu dưới ngân sách kết nối của Bài 9.4 và cho autovacuum chỗ để theo kịp đám tuple chết mà các lệnh update sinh ra.</span></div>
  <div class="lz-step"><span class="lz-k">In dấu thời gian ở mỗi lô</span><span class="lz-t">Để đoán được lúc xong</span><span class="lz-d">Hai dòng đầu ra cho bạn một TỐC ĐỘ; tốc độ cho bạn một giờ dự kiến xong. Một script nạp bù không in tiến độ thì không phân biệt được với một script đã treo, và tới phút thứ bốn mươi sẽ có người giết nó.</span></div>
</div>
<div class="note-ct">
<p><strong>Chạy script một-lần lên production, trên kho mã này.</strong> Container đã có sẵn client đã dựng và đúng engine, nên script chạy Ở ĐÓ chứ không chạy từ laptop: <code>docker exec cuonghoangdev_backend node scripts/….js</code>. Đi kèm là hai thói quen. Việc chạy nền được chốt bằng biến môi trường — <code>LLM_BACKGROUND_ENABLED</code> mặc định <code>false</code> chính là để một biến bị quên không thể lặng lẽ sinh nội dung rồi tính tiền mỗi sáng. Và mọi script có ghi dữ liệu đều phải cho người đọc bản chạy thử của nó trước; cái đầu ra ở trên, liệt kê hàng đầu tiên mà nó SẼ đổi, chính là toàn bộ ý nghĩa của mẫu này.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding" target="_blank" rel="noopener"><span class="lc-ico">🌱</span><span class="lc-body"><span class="lc-title">Prisma — seeding</span><span class="lc-sub">prisma.io/docs · Mục trong package.json, và khi nào seed tự chạy</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/data-migration" target="_blank" rel="noopener"><span class="lc-ico">📤</span><span class="lc-body"><span class="lc-title">Prisma — data migration</span><span class="lc-sub">prisma.io/docs · Lược đồ và dữ liệu trong một migration, và khi nào phải tách</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/transactions#batchbulk-operations" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">Prisma — thao tác theo lô</span><span class="lc-sub">prisma.io/docs · Dạng mảng của $transaction mà mỗi lô dùng tới</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/routine-vacuuming.html" target="_blank" rel="noopener"><span class="lc-ico">🧹</span><span class="lc-body"><span class="lc-title">PostgreSQL — vacuum định kỳ</span><span class="lc-sub">postgresql.org · Vì sao nạp bù quá nhanh để lại bảng phình, và cái gì sửa được</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — TypeScript</span><span class="lc-sub">include, exclude và project reference của tsconfig — đúng cái lỗ bài này bịt lại</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Biến một seed dựa trên create thành seed luỹ đẳng, rồi viết một script nạp bù nối lại được</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 11.5 ─────────────────────────── */
    {
      title: '11.5 — One client, and how it should die|||11.5 — Một client, và nó nên chết như thế nào',
      slug: 'pr-11-5-vong-doi-client',
      type: 'LESSON',
      description: 'Một PrismaClient cho mỗi tiến trình và mẫu globalThis chặn rò kết nối khi hot reload; SIGTERM, dumb-init và cách rút lui gọn gàng trong mười giây Docker cho; health check sống đối lại sẵn sàng; và vì sao bật log query trên production là ghi mật khẩu người dùng vào nhật ký.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.5</span>
<h2>One client, and how it should die</h2>
<p class="lead">A <code>PrismaClient</code> owns a connection pool, and a pool is a resource that outlives the code that created it. Two questions decide whether a deployment is stable: how many clients exist, and what happens to the in-flight queries when the container is told to stop. Both have short answers and both are wrong in most codebases.</p>

<h3>One client per process</h3>
<pre><code><span class="tok-comment">// ❌ A client per request. Each one opens its own pool.</span>
app.get('/bai-viet', async (req, res) =&gt; {
  const prisma = new PrismaClient();
  res.json(await prisma.socialPost.findMany({ take: 20 }));
});</code></pre>
<div class="out">warn(prisma-client) There are already 10 instances of Prisma Client
actively running.

FATAL: sorry, too many clients already</div>
<pre><code><span class="tok-comment">// ✅ src/lib/prisma.ts — created once, imported everywhere</span>
import { PrismaClient } from '@prisma/client';

const tao = () =&gt; new PrismaClient({
  log: process.env.NODE_ENV === 'production'
    ? [{ emit: 'event', level: 'error' }, { emit: 'event', level: 'warn' }]
    : [{ emit: 'event', level: 'query' }, { emit: 'stdout', level: 'error' }],
  errorFormat: process.env.NODE_ENV === 'production' ? 'minimal' : 'pretty',
}).$extends(mediaExt);

<span class="tok-comment">// Hot reload replaces the module but not globalThis</span>
const g = globalThis as unknown as { prisma?: ReturnType&lt;typeof tao&gt; };
export const prisma = g.prisma ?? tao();
if (process.env.NODE_ENV !== 'production') g.prisma = prisma;</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Why <code>globalThis</code></span><span class="lz-t">Development only</span><span class="lz-d"><code>tsx watch</code>, <code>nodemon</code> and Next.js reload the module on every save. Without the global, forty saves in an afternoon leave forty pools open, and local development starts failing with the production error message.</span></div>
  <div class="lz-step"><span class="lz-k">Why the <code>if</code></span><span class="lz-t">Production does not need it</span><span class="lz-d">A production process loads the module once. Assigning to <code>globalThis</code> there is harmless but misleading — it suggests the global is load-bearing when it is a development workaround.</span></div>
  <div class="lz-step"><span class="lz-k">Extend here, once</span><span class="lz-t">Lesson 10.5's trap</span><span class="lz-d">The exported <code>prisma</code> is the extended one, and the un-extended client is never exported. That is the only reliable way to guarantee nobody imports a client without the soft-delete filter.</span></div>
  <div class="lz-step"><span class="lz-k">Serverless is different</span><span class="lz-t">Module scope, not global</span><span class="lz-d">A warm lambda reuses module scope across invocations, so a module-level client is correct there too — with <code>connection_limit=1</code> and a pooler, per Lesson 9.4. Creating one inside the handler is the mistake.</span></div>
</div>

<h3>Shutting down: the ten seconds Docker gives you</h3>
<pre><code><span class="tok-comment"># What actually happens on a deploy</span>
docker compose up -d --no-build backend</code></pre>
<div class="out">1. SIGTERM → the container's PID 1
2. …10 giay…
3. SIGKILL → khong the bat, khong the tri hoan</div>
<pre><code><span class="tok-comment">// src/index.ts — use all ten seconds, then stop</span>
const server = app.listen(3000);

let dangTat = false;
async function tatDan(tin: string) {
  if (dangTat) return;              <span class="tok-comment">// SIGTERM can arrive twice</span>
  dangTat = true;
  console.log(&#96;[\${tin}] bat dau tat dan&#96;);

  <span class="tok-comment">// 1. Stop accepting new connections; existing requests finish.</span>
  await new Promise&lt;void&gt;((ok) =&gt; server.close(() =&gt; ok()));
  console.log('[tat] http da dong');

  <span class="tok-comment">// 2. Now the pool is idle — close it.</span>
  await prisma.$disconnect();
  console.log('[tat] prisma da ngat');

  process.exit(0);
}

process.on('SIGTERM', () =&gt; tatDan('SIGTERM'));
process.on('SIGINT',  () =&gt; tatDan('SIGINT'));

<span class="tok-comment">// A hard deadline, in case a request never finishes</span>
process.on('SIGTERM', () =&gt; setTimeout(() =&gt; process.exit(1), 9000).unref());</code></pre>
<div class="out">[SIGTERM] bat dau tat dan
[tat] http da dong          ← 1,8s (mot request dang cho database)
[tat] prisma da ngat        ← 1,9s
exit 0                       ← khong co request nao bi cat giua chung</div>
<div class="pitfall">
<p><strong>Bẫy — Node as PID 1 does not get the default signal handlers.</strong> Linux gives PID 1 no default action for SIGTERM, so a container started with <code>CMD ["node", …]</code> ignores it entirely and dies to SIGKILL ten seconds later — every request in flight cut mid-response, every transaction rolled back. Your handler is never called and there is nothing in the log to say so. <code>ENTRYPOINT ["dumb-init", "--"]</code> from Lesson 11.2 fixes it; so does <code>tini</code>, or <code>docker run --init</code>. Verify it: <code>docker stop</code> a container and check whether your shutdown lines appear.</p>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Order matters: HTTP first, Prisma second</span><span class="lz-lnote"><code>$disconnect()</code> before <code>server.close()</code> kills the pool while requests are still using it — every in-flight query fails with a connection error, and the client politely reconnects, which is the opposite of shutting down.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>beforeExit</code> is not a shutdown hook</span><span class="lz-lnote">Prisma 5 and later no longer emit a <code>beforeExit</code> event for the library engine, and Node's own <code>beforeExit</code> does not fire on an explicit <code>process.exit()</code> or on a signal. Handle signals directly.</span></div>
  <div class="lz-layer"><span class="lz-lname">The unreferenced deadline</span><span class="lz-lnote"><code>.unref()</code> means the timer will not keep the process alive on its own. If the graceful path finishes in two seconds, the process exits then; if it hangs, the timer fires at nine and exits non-zero, which is a signal in your logs rather than a silent SIGKILL.</span></div>
  <div class="lz-layer"><span class="lz-lname">Raise <code>stop_grace_period</code> if you need to</span><span class="lz-lnote">Ten seconds is the compose default. A service with long-running requests can set <code>stop_grace_period: 30s</code> — but measure first: if requests routinely take that long, the shutdown is not your real problem.</span></div>
</div>

<h3>Health checks: alive is not the same as ready</h3>
<pre><code><span class="tok-comment">// Liveness — is the process wedged? Never touch the database here.</span>
app.get('/health', (_req, res) =&gt; res.json({ ok: true }));

<span class="tok-comment">// Readiness — should this instance receive traffic?</span>
app.get('/ready', async (_req, res) =&gt; {
  if (dangTat) return res.status(503).json({ ok: false, ly_do: 'dang tat' });
  try {
    await prisma.$queryRaw&#96;SELECT 1&#96;;
    res.json({ ok: true });
  } catch (e) {
    res.status(503).json({ ok: false, ly_do: 'db' });
  }
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Liveness must not check the database</span><span class="v">If it does, a database blip restarts every container at once — turning a thirty-second database problem into a full cold start with an empty pool and a thundering herd of reconnections.</span></div>
  <div class="kv"><span class="k">Readiness may, and should</span><span class="v">A load balancer taking one instance out of rotation because its pool is exhausted is exactly right. That instance keeps running and recovers; traffic goes to the healthy ones.</span></div>
  <div class="kv"><span class="k">Readiness reports "shutting down"</span><span class="v">Returning 503 the moment SIGTERM arrives lets the load balancer stop sending requests <em>before</em> <code>server.close()</code> starts refusing them. Two seconds of 503 on one instance beats a burst of connection-refused errors.</span></div>
  <div class="kv"><span class="k">Give it a timeout</span><span class="v">A readiness check that waits ten seconds for the database is itself a hang. Wrap it: <code>Promise.race([kiemTra(), hetGio(2000)])</code> — a slow answer is a "not ready" answer.</span></div>
</div>

<h3>Logging: the query log is full of user data</h3>
<pre><code><span class="tok-comment">// Innocent-looking, and a data-protection incident on production</span>
new PrismaClient({ log: ['query'] });</code></pre>
<div class="out">prisma:query SELECT "User"."passwordHash" FROM "User" WHERE "email" = $1
prisma:query params: ["an@vidu.com"]

prisma:query INSERT INTO "Message" ("content","threadId") VALUES ($1,$2)
prisma:query params: ["so tai khoan cua minh la 0123456789", "clx7…"]</div>
<pre><code><span class="tok-comment">// Structured, sampled, and without the parameters</span>
prisma.$on('query', (e) =&gt; {
  if (e.duration &lt; 100) return;                <span class="tok-comment">// only the slow ones</span>
  logger.warn({
    truy_van: e.query.slice(0, 200),
    ms: e.duration,
    <span class="tok-comment">// e.params is deliberately NOT logged</span>
  }, 'truy van cham');
});

prisma.$on('error', (e) =&gt; logger.error({ msg: e.message }, 'prisma error'));</code></pre>
<div class="callout warn">
<p><strong>Query parameters are the values your users typed.</strong> Passwords in a login query, message bodies, phone numbers, addresses, the contents of a support ticket. Once they are in a log file they are in whatever aggregates that log, retained for whatever that system retains, readable by whoever can read it. The rule is simple: <strong>never log <code>e.params</code> outside local development.</strong> The query text alone — with its <code>$1</code> placeholders — is what you need to find a slow query anyway.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>errorFormat: 'minimal'</code></span><span class="v">The default <code>pretty</code> format embeds a colourised excerpt of your schema in every error message. It is excellent in a terminal and useless in a JSON log, where it turns a one-line error into two hundred lines of escape codes.</span></div>
  <div class="kv"><span class="k">Sample, do not silence</span><span class="v">Logging only queries over 100 ms keeps the volume manageable while still surfacing the ones Lesson 9.1 wants you to rank. Logging nothing means the first sign of a problem is a user report.</span></div>
  <div class="kv"><span class="k">Emit events, not stdout</span><span class="v"><code>emit: 'event'</code> gives you a callback, so the line goes through your logger with a request id, a trace id and consistent JSON. <code>emit: 'stdout'</code> writes Prisma's own format straight out, unstructured and uncorrelated.</span></div>
  <div class="kv"><span class="k">Metrics beat logs for pool health</span><span class="v"><code>prisma.$metrics.json()</code> from Lesson 9.4 is a few gauges you can scrape every fifteen seconds. It answers "is the pool saturated" far better than any amount of query logging, and it costs nothing per request.</span></div>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/instantiate-prisma-client" target="_blank" rel="noopener"><span class="lc-ico">1️⃣</span><span class="lc-body"><span class="lc-title">Prisma — instantiating the client</span><span class="lc-sub">prisma.io/docs · The singleton pattern and the hot-reload caveat</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/logging" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">Prisma — logging</span><span class="lc-sub">prisma.io/docs · Log levels, event emitters, and what each event carries</span></span></a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/stop/" target="_blank" rel="noopener"><span class="lc-ico">🛑</span><span class="lc-body"><span class="lc-title">docker stop — SIGTERM then SIGKILL</span><span class="lc-sub">docs.docker.com · The grace period, and how to change it</span></span></a>
<a class="link-card" href="https://nodejs.org/api/process.html#signal-events" target="_blank" rel="noopener"><span class="lc-ico">📡</span><span class="lc-body"><span class="lc-title">Node.js — signal events</span><span class="lc-sub">nodejs.org · Which signals Node handles, and the PID 1 exception</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">The process lifecycle, signals and graceful shutdown, in depth</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Send SIGTERM during a slow request and watch what a missing dumb-init costs</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5</span>
<h2>Một client, và nó nên chết như thế nào</h2>
<p class="lead">Một <code>PrismaClient</code> SỞ HỮU một connection pool, và pool là một tài nguyên sống lâu hơn đoạn mã tạo ra nó. Hai câu hỏi quyết định một bản triển khai có ổn định hay không: có BAO NHIÊU client tồn tại, và chuyện gì xảy ra với những truy vấn đang bay khi container bị bảo dừng. Cả hai đều có câu trả lời ngắn, và cả hai đều đang sai trong phần lớn kho mã.</p>

<h3>Mỗi tiến trình MỘT client</h3>
<pre><code><span class="tok-comment">// ❌ Mỗi request một client. Mỗi cái mở một pool riêng.</span>
app.get('/bai-viet', async (req, res) =&gt; {
  const prisma = new PrismaClient();
  res.json(await prisma.socialPost.findMany({ take: 20 }));
});</code></pre>
<div class="out">warn(prisma-client) There are already 10 instances of Prisma Client
actively running.

FATAL: sorry, too many clients already</div>
<pre><code><span class="tok-comment">// ✅ src/lib/prisma.ts — tạo một lần, import ở mọi nơi</span>
import { PrismaClient } from '@prisma/client';

const tao = () =&gt; new PrismaClient({
  log: process.env.NODE_ENV === 'production'
    ? [{ emit: 'event', level: 'error' }, { emit: 'event', level: 'warn' }]
    : [{ emit: 'event', level: 'query' }, { emit: 'stdout', level: 'error' }],
  errorFormat: process.env.NODE_ENV === 'production' ? 'minimal' : 'pretty',
}).$extends(mediaExt);

<span class="tok-comment">// Hot reload thay module nhưng KHÔNG thay globalThis</span>
const g = globalThis as unknown as { prisma?: ReturnType&lt;typeof tao&gt; };
export const prisma = g.prisma ?? tao();
if (process.env.NODE_ENV !== 'production') g.prisma = prisma;</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Vì sao <code>globalThis</code></span><span class="lz-t">CHỈ cho lúc phát triển</span><span class="lz-d"><code>tsx watch</code>, <code>nodemon</code> và Next.js nạp lại module ở MỖI lần lưu. Không có cái global, bốn mươi lần lưu trong một buổi chiều để lại bốn mươi pool đang mở, và việc phát triển tại máy bắt đầu hỏng với đúng thông báo lỗi của production.</span></div>
  <div class="lz-step"><span class="lz-k">Vì sao có cái <code>if</code></span><span class="lz-t">Production không cần</span><span class="lz-d">Một tiến trình production nạp module đúng một lần. Gán vào <code>globalThis</code> ở đó thì vô hại nhưng gây hiểu nhầm — nó khiến người ta tưởng cái global là bộ phận chịu lực, trong khi nó chỉ là một cách chữa cháy cho lúc phát triển.</span></div>
  <div class="lz-step"><span class="lz-k">Mở rộng ở ĐÂY, một lần</span><span class="lz-t">Cái bẫy của Bài 10.5</span><span class="lz-d">Cái <code>prisma</code> được export là cái ĐÃ mở rộng, và client chưa mở rộng thì không bao giờ được export. Đó là cách đáng tin duy nhất để bảo đảm không ai import được một client thiếu bộ lọc soft delete.</span></div>
  <div class="lz-step"><span class="lz-k">Serverless thì khác</span><span class="lz-t">Phạm vi module, không phải global</span><span class="lz-d">Một lambda còn ấm dùng lại phạm vi module qua các lần gọi, nên một client ở mức module cũng ĐÚNG ở đó — kèm <code>connection_limit=1</code> và một pooler, theo Bài 9.4. Tạo client BÊN TRONG handler mới là lỗi.</span></div>
</div>

<h3>Tắt máy: mười giây Docker cho bạn</h3>
<pre><code><span class="tok-comment"># Chuyện THẬT SỰ xảy ra khi deploy</span>
docker compose up -d --no-build backend</code></pre>
<div class="out">1. SIGTERM → PID 1 cua container
2. …10 giay…
3. SIGKILL → khong the bat, khong the tri hoan</div>
<pre><code><span class="tok-comment">// src/index.ts — dùng hết mười giây đó, rồi hãy dừng</span>
const server = app.listen(3000);

let dangTat = false;
async function tatDan(tin: string) {
  if (dangTat) return;              <span class="tok-comment">// SIGTERM có thể tới hai lần</span>
  dangTat = true;
  console.log(&#96;[\${tin}] bat dau tat dan&#96;);

  <span class="tok-comment">// 1. Ngừng nhận kết nối mới; request đang chạy thì chạy nốt.</span>
  await new Promise&lt;void&gt;((ok) =&gt; server.close(() =&gt; ok()));
  console.log('[tat] http da dong');

  <span class="tok-comment">// 2. Giờ pool đã rảnh — đóng nó lại.</span>
  await prisma.$disconnect();
  console.log('[tat] prisma da ngat');

  process.exit(0);
}

process.on('SIGTERM', () =&gt; tatDan('SIGTERM'));
process.on('SIGINT',  () =&gt; tatDan('SIGINT'));

<span class="tok-comment">// Một hạn chót cứng, phòng khi có request không bao giờ xong</span>
process.on('SIGTERM', () =&gt; setTimeout(() =&gt; process.exit(1), 9000).unref());</code></pre>
<div class="out">[SIGTERM] bat dau tat dan
[tat] http da dong          ← 1,8s (mot request dang cho database)
[tat] prisma da ngat        ← 1,9s
exit 0                       ← khong co request nao bi cat giua chung</div>
<div class="pitfall">
<p><strong>Bẫy — Node làm PID 1 thì KHÔNG có bộ xử lý tín hiệu mặc định.</strong> Linux không gán hành động mặc định nào cho SIGTERM ở PID 1, nên một container khởi động bằng <code>CMD ["node", …]</code> LỜ nó hoàn toàn rồi chết vì SIGKILL mười giây sau — mọi request đang bay bị cắt giữa chừng phản hồi, mọi giao dịch bị quay lui. Bộ xử lý của bạn không bao giờ được gọi, và trong nhật ký chẳng có gì nói ra chuyện đó. <code>ENTRYPOINT ["dumb-init", "--"]</code> của Bài 11.2 vá được; <code>tini</code> hay <code>docker run --init</code> cũng vậy. Hãy kiểm chứng: <code>docker stop</code> một container rồi xem mấy dòng tắt dần của bạn có hiện ra không.</p>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Thứ tự quan trọng: HTTP trước, Prisma sau</span><span class="lz-lnote"><code>$disconnect()</code> trước <code>server.close()</code> là giết cái pool trong lúc request còn đang dùng nó — mọi truy vấn đang bay hỏng với lỗi kết nối, rồi client lịch sự kết nối lại, tức là ngược hẳn với việc đang tắt.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>beforeExit</code> KHÔNG phải móc tắt máy</span><span class="lz-lnote">Prisma từ bản 5 trở đi không còn phát sự kiện <code>beforeExit</code> cho engine dạng thư viện, và bản thân <code>beforeExit</code> của Node cũng không nổ khi có <code>process.exit()</code> tường minh hay khi có tín hiệu. Hãy xử lý TÍN HIỆU trực tiếp.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cái hạn chót không tham chiếu</span><span class="lz-lnote"><code>.unref()</code> nghĩa là bộ đếm giờ sẽ không tự nó giữ tiến trình sống. Nếu đường tắt gọn gàng xong trong hai giây thì tiến trình thoát lúc đó; nếu nó treo, bộ đếm nổ ở giây thứ chín và thoát với mã khác 0 — một tín hiệu nằm trong nhật ký của bạn, thay vì một cú SIGKILL câm lặng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nâng <code>stop_grace_period</code> nếu cần</span><span class="lz-lnote">Mười giây là mặc định của compose. Một dịch vụ có request chạy dài có thể đặt <code>stop_grace_period: 30s</code> — nhưng hãy ĐO trước: nếu request thường xuyên lâu tới mức đó thì việc tắt máy không phải vấn đề thật của bạn.</span></div>
</div>

<h3>Health check: SỐNG không đồng nghĩa với SẴN SÀNG</h3>
<pre><code><span class="tok-comment">// Sống — tiến trình có bị kẹt không? ĐỪNG BAO GIỜ chạm cơ sở dữ liệu ở đây.</span>
app.get('/health', (_req, res) =&gt; res.json({ ok: true }));

<span class="tok-comment">// Sẵn sàng — instance này có nên nhận lưu lượng không?</span>
app.get('/ready', async (_req, res) =&gt; {
  if (dangTat) return res.status(503).json({ ok: false, ly_do: 'dang tat' });
  try {
    await prisma.$queryRaw&#96;SELECT 1&#96;;
    res.json({ ok: true });
  } catch (e) {
    res.status(503).json({ ok: false, ly_do: 'db' });
  }
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Kiểm SỐNG thì KHÔNG được chạm cơ sở dữ liệu</span><span class="v">Nếu chạm, một cú chớp của cơ sở dữ liệu sẽ khởi động lại MỌI container cùng lúc — biến một trục trặc ba mươi giây thành một cú khởi động lạnh toàn phần với pool rỗng và một đàn kết nối lại ập tới cùng lúc.</span></div>
  <div class="kv"><span class="k">Kiểm SẴN SÀNG thì được, và nên</span><span class="v">Một bộ cân bằng tải rút một instance ra khỏi vòng quay vì pool của nó cạn là hoàn toàn ĐÚNG. Instance đó vẫn chạy và tự hồi phục; lưu lượng đi tới những cái khoẻ.</span></div>
  <div class="kv"><span class="k">Sẵn sàng phải báo "đang tắt"</span><span class="v">Trả 503 ngay khoảnh khắc SIGTERM tới cho phép bộ cân bằng tải ngừng gửi request TRƯỚC khi <code>server.close()</code> bắt đầu từ chối chúng. Hai giây 503 trên một instance còn hơn một chùm lỗi connection-refused.</span></div>
  <div class="kv"><span class="k">Cho nó một hạn giờ</span><span class="v">Một phép kiểm sẵn sàng đợi cơ sở dữ liệu mười giây thì chính nó là một cú treo. Bọc nó lại: <code>Promise.race([kiemTra(), hetGio(2000)])</code> — một câu trả lời chậm chính là một câu trả lời "chưa sẵn sàng".</span></div>
</div>

<h3>Nhật ký: log truy vấn ĐẦY dữ liệu người dùng</h3>
<pre><code><span class="tok-comment">// Trông vô hại, và là một sự cố lộ dữ liệu trên production</span>
new PrismaClient({ log: ['query'] });</code></pre>
<div class="out">prisma:query SELECT "User"."passwordHash" FROM "User" WHERE "email" = $1
prisma:query params: ["an@vidu.com"]

prisma:query INSERT INTO "Message" ("content","threadId") VALUES ($1,$2)
prisma:query params: ["so tai khoan cua minh la 0123456789", "clx7…"]</div>
<pre><code><span class="tok-comment">// Có cấu trúc, lấy mẫu, và KHÔNG kèm tham số</span>
prisma.$on('query', (e) =&gt; {
  if (e.duration &lt; 100) return;                <span class="tok-comment">// chỉ những câu chậm</span>
  logger.warn({
    truy_van: e.query.slice(0, 200),
    ms: e.duration,
    <span class="tok-comment">// e.params CỐ Ý không được ghi</span>
  }, 'truy van cham');
});

prisma.$on('error', (e) =&gt; logger.error({ msg: e.message }, 'prisma error'));</code></pre>
<div class="callout warn">
<p><strong>Tham số truy vấn CHÍNH LÀ những giá trị người dùng vừa gõ.</strong> Mật khẩu trong câu truy vấn đăng nhập, nội dung tin nhắn, số điện thoại, địa chỉ, nội dung một phiếu hỗ trợ. Một khi chúng nằm trong file nhật ký thì chúng nằm trong bất cứ hệ thống nào gom nhật ký đó, lưu đúng thời hạn mà hệ thống đó lưu, và ai đọc được hệ thống đó thì đọc được chúng. Luật rất đơn giản: <strong>ĐỪNG BAO GIỜ ghi <code>e.params</code> ra ngoài môi trường phát triển tại máy.</strong> Riêng phần chữ của câu truy vấn — với mấy chỗ giữ chỗ <code>$1</code> — vốn đã đủ để tìm ra một truy vấn chậm rồi.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>errorFormat: 'minimal'</code></span><span class="v">Định dạng mặc định <code>pretty</code> nhúng một đoạn lược đồ có tô màu vào MỌI thông báo lỗi. Nó tuyệt vời trong terminal và vô dụng trong một nhật ký JSON, nơi nó biến một lỗi một dòng thành hai trăm dòng mã thoát màu.</span></div>
  <div class="kv"><span class="k">Lấy mẫu, đừng bịt miệng</span><span class="v">Chỉ ghi những truy vấn trên 100 ms giữ khối lượng ở mức quản được mà vẫn lộ ra đúng những câu Bài 9.1 muốn bạn xếp hạng. Không ghi gì cả nghĩa là dấu hiệu đầu tiên của vấn đề sẽ là một lời phàn nàn của người dùng.</span></div>
  <div class="kv"><span class="k">Phát sự kiện, đừng đẩy ra stdout</span><span class="v"><code>emit: 'event'</code> cho bạn một hàm gọi lại, nên dòng nhật ký đi qua logger của bạn kèm id request, id vết và JSON nhất quán. <code>emit: 'stdout'</code> ghi thẳng định dạng riêng của Prisma ra ngoài, không cấu trúc và không nối được với gì.</span></div>
  <div class="kv"><span class="k">Với sức khoẻ pool, CHỈ SỐ hơn nhật ký</span><span class="v"><code>prisma.$metrics.json()</code> của Bài 9.4 là vài cái đồng hồ bạn quét mười lăm giây một lần. Nó trả lời "pool có bão hoà không" tốt hơn hẳn mọi khối lượng log truy vấn, và nó không tốn gì cho mỗi request.</span></div>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/instantiate-prisma-client" target="_blank" rel="noopener"><span class="lc-ico">1️⃣</span><span class="lc-body"><span class="lc-title">Prisma — khởi tạo client</span><span class="lc-sub">prisma.io/docs · Mẫu singleton và điều cần lưu ý khi hot reload</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/logging" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">Prisma — nhật ký</span><span class="lc-sub">prisma.io/docs · Các mức log, bộ phát sự kiện, và mỗi sự kiện mang theo gì</span></span></a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/stop/" target="_blank" rel="noopener"><span class="lc-ico">🛑</span><span class="lc-body"><span class="lc-title">docker stop — SIGTERM rồi SIGKILL</span><span class="lc-sub">docs.docker.com · Khoảng ân hạn, và cách đổi nó</span></span></a>
<a class="link-card" href="https://nodejs.org/api/process.html#signal-events" target="_blank" rel="noopener"><span class="lc-ico">📡</span><span class="lc-body"><span class="lc-title">Node.js — sự kiện tín hiệu</span><span class="lc-sub">nodejs.org · Node xử lý những tín hiệu nào, và ngoại lệ PID 1</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">Vòng đời tiến trình, tín hiệu và tắt dần, nói kỹ</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Gửi SIGTERM giữa một request chậm và xem cái giá của việc thiếu dumb-init</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 11.6 ─────────────────────────── */
    {
      title: '11.6 — Quiz: shipping to production|||11.6 — Quiz: đưa lên production',
      slug: 'pr-11-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về engine trong ảnh, thứ tự trong Dockerfile, cửa sổ hai phiên bản khi deploy, seed luỹ đẳng, và cách một tiến trình nên chết.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.6</span>
<h2>Quiz: shipping to production</h2>
<p class="lead">Eight questions on the gap between "it works on my machine" and "it works on the server". Five of them come from failures that actually happened on this codebase, which is why they are worth more than the general advice they replace.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> The Rust engine is platform-specific and only fails at container start — verify the image, not the build (11.1). The schema must be copied before <code>npm ci</code>, generate must run on the runtime base, and <code>--omit=dev</code> takes the CLI with it (11.2). A deploy has a window where old code meets new schema, so migrations go one way and expand/contract handles the rest (11.3). Seeds run many times and use <code>upsert</code>; backfills run for hours and resume from their own filter (11.4). One client per process, and SIGTERM means close HTTP first, then the pool (11.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.6</span>
<h2>Quiz: đưa lên production</h2>
<p class="lead">Tám câu về khoảng cách giữa "máy tôi chạy được" và "máy chủ chạy được". Năm câu trong số đó tới từ những cú hỏng CÓ THẬT trên chính kho mã này, và đó là lý do chúng đáng giá hơn mấy lời khuyên chung chung mà chúng thay thế.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Engine Rust gắn với nền chạy và chỉ hỏng lúc container khởi động — hãy xác minh cái ẢNH, không phải cái bản dựng (11.1). Schema phải được copy trước <code>npm ci</code>, generate phải chạy trên đúng nền runtime, và <code>--omit=dev</code> mang luôn cả CLI đi (11.2). Một lần deploy có một CỬA SỔ mã cũ gặp lược đồ mới, nên migration đi một chiều còn phần còn lại do mở-rộng-thu-hẹp lo (11.3). Seed chạy nhiều lần nên dùng <code>upsert</code>; nạp bù chạy hàng giờ và nối lại từ chính bộ lọc của nó (11.4). Mỗi tiến trình một client, và SIGTERM nghĩa là đóng HTTP trước, pool sau (11.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Your build is green, the push is green, the container swap reports success — and the API returns 502 on a loop. What is the most likely cause?|||Bản dựng xanh, lần đẩy xanh, tráo container báo thành công — mà API trả 502 thành vòng lặp. Nguyên nhân khả dĩ nhất là gì?',
            options: [
              'The database is down|||Cơ sở dữ liệu đang chết',
              'The Prisma engine in the image does not match the image libc: a debian engine in a musl image, so new PrismaClient() throws at startup and the restart policy loops|||Engine Prisma trong ảnh không khớp libc của ảnh: engine debian nằm trong ảnh musl, nên new PrismaClient() ném lỗi ngay lúc khởi động và chính sách khởi động lại quay vòng',
              'The port mapping is wrong|||Ánh xạ cổng bị sai',
              'TypeScript compiled to the wrong target|||TypeScript biên dịch sai target',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which single command proves a built image can actually run Prisma, without needing a database?|||Câu lệnh DUY NHẤT nào chứng minh một ảnh đã dựng thật sự chạy được Prisma, mà không cần cơ sở dữ liệu?',
            options: [
              'docker run in the image and construct a PrismaClient — that loads the engine, and the connection is lazy|||docker run vào ảnh rồi dựng một PrismaClient — việc đó NẠP engine, còn kết nối thì lười',
              'docker build --no-cache|||docker build --no-cache',
              'npx prisma validate on the host|||npx prisma validate trên máy nhà',
              'Check the image size against the previous one|||So dung lượng ảnh với ảnh trước đó',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A Dockerfile copies package*.json, runs npm ci, then COPY . . — and npm ci fails. Why?|||Một Dockerfile copy package*.json, chạy npm ci, rồi COPY . . — và npm ci hỏng. Vì sao?',
            options: [
              'npm ci needs a lockfile version 3|||npm ci cần lockfile phiên bản 3',
              'The postinstall script runs prisma generate, and prisma/schema.prisma has not been copied yet — copy prisma/ before npm ci|||Script postinstall chạy prisma generate, mà prisma/schema.prisma thì chưa được copy vào — hãy copy prisma/ TRƯỚC npm ci',
              'node_modules was not excluded in .dockerignore|||node_modules chưa được loại trong .dockerignore',
              'The base image is missing openssl|||Ảnh nền thiếu openssl',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Should migrations run before or after the container swap?|||Migration nên chạy trước hay sau khi tráo container?',
            options: [
              'After, so the new code is ready for them|||Sau, để mã mới sẵn sàng đón chúng',
              'Before, so the window is "old code, new schema" — safe as long as each migration is backward-compatible, which expand/contract guarantees|||TRƯỚC, để cửa sổ là "mã cũ, lược đồ mới" — an toàn chừng nào mỗi migration còn tương thích ngược, điều mà mở-rộng-thu-hẹp bảo đảm',
              'Both at the same time, to shorten the window|||Cả hai cùng lúc, cho cửa sổ ngắn lại',
              'It does not matter if the deploy is fast|||Không quan trọng nếu deploy nhanh',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You want to rename a column that production code reads. How many deploys does it take to do safely?|||Bạn muốn đổi tên một cột mà mã production đang đọc. Cần bao nhiêu lần deploy để làm an toàn?',
            options: [
              'One: change the model and let Prisma generate the ALTER|||Một: sửa model rồi để Prisma sinh câu ALTER',
              'Three: add the new nullable column and write both; backfill, then switch the read; then stop writing the old one and drop it — unless @map makes it a rename in code only|||Ba: thêm cột mới cho phép null và ghi cả hai; nạp bù rồi chuyển đường đọc; rồi ngừng ghi cột cũ và xoá nó — trừ khi @map biến nó thành chuyện đổi tên chỉ trong mã',
              'Two: rename, then backfill|||Hai: đổi tên, rồi nạp bù',
              'Zero: put the rename in a data migration|||Không cần: nhét việc đổi tên vào một data migration',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why should a migration that touches a large table start with SET lock_timeout?|||Vì sao một migration đụng vào bảng lớn nên bắt đầu bằng SET lock_timeout?',
            options: [
              'It makes the ALTER run faster|||Nó làm câu ALTER chạy nhanh hơn',
              'Because a waiting ALTER blocks every query that arrives after it, including SELECTs — so one slow query plus one "instant" migration is a full outage; the timeout fails the migration instead|||Vì một câu ALTER đang chờ sẽ CHẶN mọi truy vấn tới sau nó, kể cả SELECT — nên một truy vấn chậm cộng một migration "tức thì" là một cú chết toàn phần; hạn giờ khoá làm migration hỏng thay vì làm website chết',
              'Prisma requires it for ALTER statements|||Prisma bắt buộc phải có nó với câu ALTER',
              'It prevents deadlocks between migrations|||Nó ngăn deadlock giữa các migration',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What makes a seed script safe to run on an existing database?|||Điều gì làm một script seed an toàn khi chạy lên một cơ sở dữ liệu đã có dữ liệu?',
            options: [
              'Wrapping it in a transaction|||Bọc nó trong một giao dịch',
              'upsert on a stable natural key, with real values in both create and update — and demo data behind an explicit flag|||upsert trên một khoá tự nhiên ổn định, với giá trị THẬT ở cả create lẫn update — và dữ liệu demo nằm sau một cờ tường minh',
              'Running it only when NODE_ENV is not production|||Chỉ chạy nó khi NODE_ENV khác production',
              'Deleting all rows first so the state is known|||Xoá sạch mọi hàng trước cho trạng thái rõ ràng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'On SIGTERM, what order should shutdown happen in, and what breaks if a container runs node as PID 1 without an init?|||Khi có SIGTERM, việc tắt nên theo thứ tự nào, và cái gì hỏng nếu container chạy node làm PID 1 mà không có init?',
            options: [
              'Close HTTP first, then $disconnect. Without an init, PID 1 has no default SIGTERM action, so the handler never runs and SIGKILL cuts every in-flight request ten seconds later|||Đóng HTTP trước, rồi $disconnect. Không có init thì PID 1 không có hành động mặc định cho SIGTERM, nên bộ xử lý không bao giờ chạy và SIGKILL cắt mọi request đang bay mười giây sau',
              '$disconnect first, then close HTTP; the init only affects logging|||$disconnect trước, rồi đóng HTTP; cái init chỉ ảnh hưởng tới nhật ký',
              'Order does not matter; Prisma handles it via beforeExit|||Thứ tự không quan trọng; Prisma tự lo qua beforeExit',
              'Call process.exit(0) immediately to free the port|||Gọi process.exit(0) ngay để giải phóng cổng',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
