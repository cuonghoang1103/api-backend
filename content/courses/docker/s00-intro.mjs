/**
 * Docker — Mục 0: giới thiệu, Docker giải quyết vấn đề gì, cài đặt, năm phút đầu tiên.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Section 0 — What Docker solves, and getting set up|||Mục 0 — Docker giải quyết gì, và cài đặt',
  description: 'Ba cú hỏng có thật mà Docker chấm dứt, cái nó KHÔNG phải, lộ trình 13 mục, cài đặt trên Linux/macOS/Windows, và năm phút đầu tiên chạy một thứ có thật.',
  lessons: [
    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — What Docker actually solves|||0.1 — Docker thật sự giải quyết cái gì',
      slug: 'dk-0-1-van-de',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba cú hỏng có thật mà container chấm dứt, bốn thứ Docker cho bạn, bốn thứ nó KHÔNG phải, khoá này dành cho ai, và bản đồ 13 mục.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>What Docker actually solves</h2>
<p class="lead">Every explanation of Docker starts with the word "container", which explains nothing to anyone who has not already understood it. So this course starts somewhere else: with three failures you have probably lived through, and the specific mechanism that makes each of them impossible.</p>

<h3>Failure 1 — "it works on my machine"</h3>
<div class="out">$ npm run build
✓ built in 4.21s

$ ssh deploy@vps-1 'cd /srv/app &amp;&amp; npm run build'
ERROR: Cannot find module 'sharp'
Error: The module '/srv/app/node_modules/sharp/build/Release/sharp.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 115. This version requires NODE_MODULE_VERSION 108.</div>
<p>Your laptop has Node 22, the server has Node 18, and <code>sharp</code> is a native module compiled against whichever it found. Nobody wrote a bug. The code is identical. The <em>environments</em> are different, and the environment was never part of what you shipped.</p>
<p>An image fixes this by making the environment <strong>part of the artifact</strong>. The Node version, the system libraries, the compiled native modules and your code all travel together as one thing. If it built on your laptop, the same bytes run on the server.</p>

<h3>Failure 2 — the README that takes a day</h3>
<div class="out">## Getting started

1. Install Node 22 (nvm recommended)
2. Install PostgreSQL 16 and create a database &#96;app_dev&#96;
3. Install Redis 7
4. Install ImageMagick and libvips (macOS: brew, Ubuntu: apt, see below)
5. Copy .env.example to .env and ask someone for the values
6. Run the migrations (needs psql on PATH)
7. Seed the database
8. In three separate terminals: npm run dev, npm run worker, redis-server</div>
<p>Eight steps, four of which behave differently on macOS and Linux, and every one a chance for a new colleague to end up on a slightly different version than everyone else. Six months later nobody can reproduce a bug because no two machines are the same.</p>
<p>The Compose version of that README is one line — <code>docker compose up</code> — and it produces byte-identical PostgreSQL, Redis and libvips on every machine that runs it. Chapters 9 and 10 build exactly this.</p>

<h3>Failure 3 — the deploy that took the site down</h3>
<div class="out">$ ssh root@vps-1 'apt upgrade -y &amp;&amp; systemctl restart backend'
...
backend.service: Main process exited, code=exited, status=1/FAILURE
Error: libssl.so.3: cannot open shared object file: No such file or directory</div>
<p>An unrelated system upgrade replaced a shared library, and an application that had been running for months stopped starting. The machine drifted; the app was collateral damage.</p>
<p>A container carries its own userland — its own libssl, its own libc, its own everything above the kernel. Upgrading the host does not reach inside it. And when a deploy does go wrong, the previous image is still there, so rolling back is retagging one thing rather than reinstalling packages under pressure (Chapter 11).</p>

<h3>What Docker gives you, stated plainly</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Reproducibility</span><span class="v">The same image produces the same running environment on your laptop, in CI, and on the server. This is the whole point; everything else follows from it.</span></div>
  <div class="kv"><span class="k">Isolation</span><span class="v">Two projects can need Node 18 and Node 22, or PostgreSQL 14 and 16, on one machine, and never know about each other. No version managers, no conflicts, nothing to uninstall afterwards.</span></div>
  <div class="kv"><span class="k">Disposability</span><span class="v">Break a container and delete it; a new one is two seconds away, identical to the first. This changes how you experiment — "let me just try it" stops being risky.</span></div>
  <div class="kv"><span class="k">A unit you can ship</span><span class="v">One artifact, versioned and stored in a registry, that CI builds and a server pulls. Deployment becomes "run this exact thing" instead of "perform these steps and hope".</span></div>
</div>

<h3>What Docker is NOT</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Not a virtual machine</span><span class="v">There is no guest kernel. A container is a normal Linux process with a restricted view of the system — you can see it in <code>ps</code> on the host. Chapter 1 shows exactly what the restriction consists of, and why it makes containers start in milliseconds while VMs take a minute.</span></div>
  <div class="kv"><span class="k">Not a security boundary you can lean on</span><span class="v">It is a real boundary and a useful one, but a container shares the host kernel. Running untrusted code from strangers needs more than the defaults — Chapter 6 covers what "more" means and which defaults matter.</span></div>
  <div class="kv"><span class="k">Not automatically faster or smaller</span><span class="v">A careless image is 1.4GB and rebuilds for four minutes on a one-line change. A careful one is 180MB and rebuilds in six seconds. The difference is Chapters 5 and 6, and it is entirely in your hands.</span></div>
  <div class="kv"><span class="k">Not a reason to containerise everything</span><span class="v">A static site on a CDN does not need a container. A one-off script does not need a container. The judgement of when NOT to reach for it is part of using it well, and this course says so where it applies.</span></div>
</div>
<div class="callout"><strong>The one-sentence version.</strong> An <strong>image</strong> is a read-only filesystem plus the metadata to start a process in it. A <strong>container</strong> is one running instance of that image with a writable scratch layer on top. Everything in this course — Dockerfiles, layers, volumes, networks, Compose — is machinery for building good images and running containers well. If you keep those two definitions straight, the rest composes.</div>

<h3>Who this course is for</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">You have an app and no idea how to ship it</span><span class="v">Start at Chapter 1 and read in order. By Chapter 10 you will have a full stack running from one file, and by Chapter 11 it will be on a server.</span></div>
  <div class="kv"><span class="k">You copy-paste Dockerfiles that mostly work</span><span class="v">Chapters 4–6 are for you. They explain why the order of your <code>COPY</code> lines decides your build time, and how a 1.2GB image becomes 180MB without removing anything you need.</span></div>
  <div class="kv"><span class="k">You use Compose but do not trust it</span><span class="v">Chapters 7–10: what <code>depends_on</code> actually guarantees (less than you think), where your data really lives, and why one container cannot reach another by <code>localhost</code>.</span></div>
  <div class="kv"><span class="k">Something is broken right now</span><span class="v">Chapter 12 is a cookbook, readable out of order: exit 137, exit 127, a build that fails only in CI, a container that starts and immediately dies with no logs.</span></div>
</div>

<h3>The roadmap</h3>
<div class="lz-map">
  <div class="lz-stage">Part 1 — The model (Ch 1–3)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Containers &amp; images: the mental model</div><div class="lz-nsub">Namespaces, cgroups and layers — what a container actually is, and the lifecycle every container follows</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Running containers</div><div class="lz-nsub"><code>run</code>, <code>exec</code>, <code>logs</code>, <code>inspect</code>, ports, environment, <code>--rm</code> — the flags you will use every day</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Images &amp; registries</div><div class="lz-nsub">Tags versus digests, Docker Hub and GHCR, pulling, pushing, and why <code>:latest</code> causes outages</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 2 — Building (Ch 4–6)</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Dockerfile, from basics to fluent</div><div class="lz-nsub">Every instruction, shell versus exec form, and the <code>CMD</code>/<code>ENTRYPOINT</code> distinction that trips up everyone once</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Layers, cache &amp; fast builds</div><div class="lz-nsub">Why <code>COPY package.json</code> comes before <code>COPY .</code> — turning a four-minute rebuild into six seconds</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Small and safe images</div><div class="lz-nsub">Multi-stage builds, alpine vs slim vs distroless, musl vs glibc, running as a non-root user, scanning</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 3 — Data, network, Compose (Ch 7–10)</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Data: volumes, bind mounts, tmpfs</div><div class="lz-nsub">Where your database actually lives, backing it up, and the file-permission problem every bind mount creates</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Networking</div><div class="lz-nsub">Bridge networks and built-in DNS, publish versus expose, why <code>localhost</code> means something different inside a container</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Docker Compose</div><div class="lz-nsub">One file for a whole stack: services, healthchecks, <code>depends_on</code>, environment, profiles, override files</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Compose in real life</div><div class="lz-nsub">A working stack — Next.js, a Node API, PostgreSQL, Redis, nginx — with migrations, seeds, and separate dev and prod files</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 4 — Production (Ch 11–12)</div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Running it in production</div><div class="lz-nsub">Restart policies, memory limits, log rotation, healthchecks, updating without downtime, CI/CD, and keeping the disk from filling</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Diagnosing containers</div><div class="lz-nsub">A cookbook: exit 137 and 127, builds that fail only in CI, containers that cannot reach each other, the wrong-architecture image</div></div></div>
</div>

<h3>How to read this course</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Chapters 1–3</span><span class="lz-t">In order, at a terminal</span><span class="lz-d">These build the model everything else assumes. Skipping them is why people find Docker confusing three months in — the commands work but nothing means anything.</span></div>
  <div class="lz-step"><span class="lz-k">Chapters 4–6</span><span class="lz-t">In order, with your own project open</span><span class="lz-d">Write the Dockerfile for something you actually have. The lessons are built so each one improves the file you are holding.</span></div>
  <div class="lz-step"><span class="lz-k">Chapters 7–10</span><span class="lz-t">In order — they build one stack together</span><span class="lz-d">Chapter 10 assembles what 7, 8 and 9 introduce separately. Reading 10 first is possible but you will be taking a lot on trust.</span></div>
  <div class="lz-step"><span class="lz-k">Chapters 11–12</span><span class="lz-t">Reference-shaped</span><span class="lz-d">Read 11 before you put anything on a server. Open 12 when something breaks; it is written to be searched, not studied.</span></div>
</div>

<h3>Conventions in this course</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Every output block is real</span><span class="v">The dark blocks are copied from actual runs on Docker Engine 27 / Ubuntu 24.04, including the ugly parts. Where a version matters, the lesson says so.</span></div>
  <div class="kv"><span class="k">Bilingual, side by side</span><span class="v">Every lesson exists in English and Vietnamese. The English half uses the exact terms you will meet in error messages and documentation; the Vietnamese half explains them.</span></div>
  <div class="kv"><span class="k">Diagrams, not decoration</span><span class="v">Each diagram exists to make one specific relationship visible — layers stacking, a request crossing a network boundary, a lifecycle. If a paragraph could say it as clearly, there is no diagram.</span></div>
  <div class="kv"><span class="k">A pitfall box per lesson</span><span class="v">The mistake that lesson's material actually causes, and how to recognise it from the error message. These are the parts worth re-reading.</span></div>
  <div class="kv"><span class="k">Graded practice on Code Lab</span><span class="v">Each lesson links to exercises for that chapter. Reading about layer caching and watching a rebuild go from four minutes to six seconds are different experiences.</span></div>
</div>

<a class="link-card" href="https://docs.docker.com/get-started/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Docker — official Get Started guide</span><span class="lc-sub">The vendor's own introduction, kept current with each release. Useful as a second voice on Chapters 1–4, and the place to check when a flag in this course has changed.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/dockerfile/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Dockerfile reference</span><span class="lc-sub">Every instruction with its exact semantics. You will come back to this many times — bookmark it now rather than searching for it later.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: the Docker track on Code Lab</span><span class="lc-sub">Graded exercises for every chapter, in a real environment. Start here after Lesson 0.3 and keep the tab open as you read.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> learning the commands before the model. It is entirely possible to memorise <code>docker run -d -p 8080:80 nginx</code> and use it successfully for a year without knowing what any of it means — until the day a port does not publish, a volume does not persist, or a container cannot reach another one. Every question in Chapter 12 is answerable in seconds if you hold the model from Chapter 1, and unanswerable without it. Give Chapter 1 an hour; it repays it many times over.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Docker's actual product is <em>reproducibility</em> — the environment becomes part of what you ship, and the three failures at the top of this lesson all come from it not being. An image is a read-only filesystem plus start-up metadata; a container is one running instance of it. And a container is a process, not a virtual machine — that single fact explains the speed, the size, the sharing of the host kernel, and most of the surprises.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Docker thật sự giải quyết cái gì</h2>
<p class="lead">Mọi lời giải thích về Docker đều mở đầu bằng chữ "container", và chữ đó không giải thích được gì cho người chưa hiểu nó. Nên khoá này bắt đầu từ chỗ khác: từ ba cú hỏng mà rất có thể bạn đã sống qua, và từ cơ chế cụ thể khiến mỗi cú hỏng đó trở thành bất khả.</p>

<h3>Cú hỏng 1 — "máy tôi chạy được mà"</h3>
<div class="out">$ npm run build
✓ built in 4.21s

$ ssh deploy@vps-1 'cd /srv/app &amp;&amp; npm run build'
ERROR: Cannot find module 'sharp'
Error: The module '/srv/app/node_modules/sharp/build/Release/sharp.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 115. This version requires NODE_MODULE_VERSION 108.</div>
<p>Laptop của bạn chạy Node 22, máy chủ chạy Node 18, và <code>sharp</code> là một mô-đun native được biên dịch theo cái nào nó tìm thấy. Không ai viết ra con bọ nào cả. Mã thì giống hệt. <em>MÔI TRƯỜNG</em> mới khác nhau, và môi trường thì chưa bao giờ nằm trong thứ bạn đem đi.</p>
<p>Một image chữa chuyện này bằng cách biến môi trường thành <strong>MỘT PHẦN CỦA CÁI ĐEM ĐI</strong>. Phiên bản Node, các thư viện hệ thống, những mô-đun native đã biên dịch và mã của bạn cùng đi chung như một thứ duy nhất. Dựng được trên laptop thì đúng những byte đó chạy trên máy chủ.</p>

<h3>Cú hỏng 2 — cái README ngốn hết một ngày</h3>
<div class="out">## Bắt đầu

1. Cài Node 22 (nên dùng nvm)
2. Cài PostgreSQL 16 và tạo cơ sở dữ liệu &#96;app_dev&#96;
3. Cài Redis 7
4. Cài ImageMagick và libvips (macOS: brew, Ubuntu: apt, xem bên dưới)
5. Chép .env.example thành .env rồi hỏi ai đó xin giá trị
6. Chạy migration (cần psql nằm trên PATH)
7. Seed cơ sở dữ liệu
8. Mở ba terminal riêng: npm run dev, npm run worker, redis-server</div>
<p>Tám bước, bốn trong số đó hành xử khác nhau trên macOS và Linux, và mỗi bước là một cơ hội để một đồng nghiệp mới kết thúc ở một phiên bản hơi khác mọi người. Sáu tháng sau không ai tái hiện được một con bọ vì không có hai cái máy nào giống nhau.</p>
<p>Bản Compose của cái README đó dài một dòng — <code>docker compose up</code> — và nó tạo ra PostgreSQL, Redis và libvips giống nhau tới từng byte trên mọi máy chạy nó. Chương 9 và 10 dựng đúng cái này.</p>

<h3>Cú hỏng 3 — bản deploy làm sập trang</h3>
<div class="out">$ ssh root@vps-1 'apt upgrade -y &amp;&amp; systemctl restart backend'
...
backend.service: Main process exited, code=exited, status=1/FAILURE
Error: libssl.so.3: cannot open shared object file: No such file or directory</div>
<p>Một lần nâng cấp hệ thống chẳng liên quan đã thay một thư viện chia sẻ, và một ứng dụng chạy êm hàng tháng trời bỗng không khởi động được. Cái máy TRÔI DẠT; ứng dụng chỉ là thiệt hại kèm theo.</p>
<p>Một container mang theo phần userland của riêng nó — libssl riêng, libc riêng, mọi thứ phía trên nhân đều là của riêng nó. Nâng cấp máy chủ không với tới bên trong nó được. Và khi một bản deploy có hỏng thật thì ảnh cũ vẫn còn đó, nên quay lui chỉ là gắn lại một cái tag chứ không phải cài lại các gói trong lúc đang bị dồn ép (Chương 11).</p>

<h3>Docker cho bạn cái gì, nói thẳng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tái lập được</span><span class="v">Cùng một image tạo ra cùng một môi trường chạy trên laptop của bạn, trong CI, và trên máy chủ. Đây là toàn bộ điểm mấu chốt; mọi thứ khác đều suy ra từ đó.</span></div>
  <div class="kv"><span class="k">Cô lập</span><span class="v">Hai dự án có thể cùng cần Node 18 và Node 22, hoặc PostgreSQL 14 và 16, trên một cái máy, mà không biết tới nhau. Không cần trình quản lý phiên bản, không xung đột, không có gì phải gỡ về sau.</span></div>
  <div class="kv"><span class="k">Vứt đi được</span><span class="v">Phá một container rồi xoá nó đi; một cái mới cách bạn hai giây, giống hệt cái đầu. Điều đó đổi cách bạn thử nghiệm — "để tôi thử phát xem sao" thôi còn là chuyện rủi ro.</span></div>
  <div class="kv"><span class="k">Một đơn vị đem đi được</span><span class="v">Một hiện vật duy nhất, có phiên bản và nằm trong registry, do CI dựng và máy chủ kéo về. Triển khai trở thành "chạy đúng cái này" thay vì "làm theo mấy bước này rồi cầu may".</span></div>
</div>

<h3>Docker KHÔNG phải cái gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Không phải máy ảo</span><span class="v">Không có nhân khách nào cả. Một container là một tiến trình Linux bình thường với tầm nhìn bị hạn chế về hệ thống — bạn thấy được nó trong <code>ps</code> ở máy chủ. Chương 1 chỉ ra chính xác cái hạn chế đó gồm những gì, và vì sao container khởi động trong mili giây còn máy ảo mất cả phút.</span></div>
  <div class="kv"><span class="k">Không phải một ranh giới an ninh để dựa hẳn vào</span><span class="v">Nó là một ranh giới thật và hữu ích, nhưng container DÙNG CHUNG nhân với máy chủ. Chạy mã không đáng tin của người lạ thì cần nhiều hơn mức mặc định — Chương 6 nói "nhiều hơn" nghĩa là gì và mặc định nào đáng quan tâm.</span></div>
  <div class="kv"><span class="k">Không tự động nhanh hơn hay nhẹ hơn</span><span class="v">Một cái ảnh làm cẩu thả nặng 1,4GB và dựng lại mất bốn phút chỉ vì đổi một dòng. Một cái làm cẩn thận nặng 180MB và dựng lại trong sáu giây. Khác biệt nằm ở Chương 5 và 6, và nó hoàn toàn trong tay bạn.</span></div>
  <div class="kv"><span class="k">Không phải lý do để đóng gói MỌI THỨ</span><span class="v">Một trang tĩnh trên CDN không cần container. Một script chạy một lần không cần container. Cái phán đoán biết KHI NÀO KHÔNG nên với tay tới nó cũng là một phần của việc dùng nó giỏi, và khoá này nói thẳng ở những chỗ có liên quan.</span></div>
</div>
<div class="callout"><strong>Bản một câu.</strong> Một <strong>IMAGE</strong> là một hệ thống file chỉ-đọc cộng với phần siêu dữ liệu để khởi chạy một tiến trình bên trong nó. Một <strong>CONTAINER</strong> là một bản đang chạy của cái image đó, có thêm một tầng nháp ghi được nằm trên. Mọi thứ trong khoá này — Dockerfile, tầng ảnh, volume, mạng, Compose — đều là bộ máy để dựng ảnh tốt và chạy container cho khéo. Giữ đúng hai định nghĩa đó thì phần còn lại tự ghép vào.</div>

<h3>Khoá này dành cho ai</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bạn có một ứng dụng và không biết đem nó lên mạng kiểu gì</span><span class="v">Hãy bắt đầu ở Chương 1 và đọc theo thứ tự. Tới Chương 10 bạn sẽ có cả một hệ thống chạy từ một file, và tới Chương 11 nó sẽ nằm trên máy chủ.</span></div>
  <div class="kv"><span class="k">Bạn chép Dockerfile của người khác và nó gần như chạy được</span><span class="v">Chương 4–6 dành cho bạn. Chúng giải thích vì sao thứ tự các dòng <code>COPY</code> quyết định thời gian dựng của bạn, và làm sao một ảnh 1,2GB thành 180MB mà không bỏ đi thứ gì bạn cần.</span></div>
  <div class="kv"><span class="k">Bạn dùng Compose mà không tin nó</span><span class="v">Chương 7–10: <code>depends_on</code> thật sự bảo đảm cái gì (ít hơn bạn tưởng), dữ liệu của bạn nằm ở đâu thật, và vì sao container này không gọi container kia bằng <code>localhost</code> được.</span></div>
  <div class="kv"><span class="k">Có thứ đang hỏng ngay lúc này</span><span class="v">Chương 12 là sách công thức, đọc lộn xộn được: exit 137, exit 127, một bản dựng chỉ hỏng trong CI, một container lên rồi chết ngay mà không có log nào.</span></div>
</div>

<h3>Lộ trình</h3>
<div class="lz-map">
  <div class="lz-stage">Phần 1 — Mô hình (Chương 1–3)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Container &amp; image: mô hình tư duy</div><div class="lz-nsub">Namespace, cgroup và tầng ảnh — container THẬT RA là gì, và vòng đời mà mọi container đều đi qua</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Chạy container</div><div class="lz-nsub"><code>run</code>, <code>exec</code>, <code>logs</code>, <code>inspect</code>, cổng, biến môi trường, <code>--rm</code> — những cờ bạn sẽ dùng mỗi ngày</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Image &amp; registry</div><div class="lz-nsub">Tag so với digest, Docker Hub và GHCR, kéo, đẩy, và vì sao <code>:latest</code> gây sự cố</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 2 — Dựng ảnh (Chương 4–6)</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Dockerfile, từ cơ bản tới trôi chảy</div><div class="lz-nsub">Mọi chỉ thị, dạng shell so với dạng exec, và khác biệt <code>CMD</code>/<code>ENTRYPOINT</code> khiến ai cũng vấp đúng một lần</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Tầng ảnh, cache &amp; dựng nhanh</div><div class="lz-nsub">Vì sao <code>COPY package.json</code> phải đứng trước <code>COPY .</code> — biến bốn phút dựng lại thành sáu giây</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Ảnh nhỏ và an toàn</div><div class="lz-nsub">Dựng nhiều tầng, alpine với slim với distroless, musl với glibc, chạy dưới người dùng không phải root, quét lỗ hổng</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 3 — Dữ liệu, mạng, Compose (Chương 7–10)</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Dữ liệu: volume, bind mount, tmpfs</div><div class="lz-nsub">Cơ sở dữ liệu của bạn thật ra nằm ở đâu, sao lưu nó thế nào, và bài toán quyền file mà mọi bind mount đều tạo ra</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Mạng</div><div class="lz-nsub">Mạng bridge và DNS có sẵn, publish so với expose, vì sao <code>localhost</code> mang nghĩa khác bên trong container</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Docker Compose</div><div class="lz-nsub">Một file cho cả hệ thống: service, healthcheck, <code>depends_on</code>, biến môi trường, profile, file ghi đè</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Compose trong đời thật</div><div class="lz-nsub">Một hệ thống chạy được — Next.js, một API Node, PostgreSQL, Redis, nginx — kèm migration, seed, và file dev tách khỏi file prod</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 4 — Production (Chương 11–12)</div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Vận hành trên production</div><div class="lz-nsub">Chính sách khởi động lại, trần bộ nhớ, xoay vòng log, healthcheck, cập nhật không gián đoạn, CI/CD, và giữ cho đĩa khỏi đầy</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Chẩn đoán container</div><div class="lz-nsub">Sách công thức: exit 137 và 127, bản dựng chỉ hỏng trong CI, container không với tới nhau, ảnh sai kiến trúc</div></div></div>
</div>

<h3>Đọc khoá này thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Chương 1–3</span><span class="lz-t">Theo thứ tự, ngồi trước một cái terminal</span><span class="lz-d">Mấy chương này dựng nên cái mô hình mà mọi thứ còn lại giả định là bạn đã có. Bỏ qua chúng là lý do ba tháng sau người ta thấy Docker rối rắm — lệnh thì chạy được mà chẳng cái gì có ý nghĩa.</span></div>
  <div class="lz-step"><span class="lz-k">Chương 4–6</span><span class="lz-t">Theo thứ tự, mở sẵn dự án của chính bạn</span><span class="lz-d">Hãy viết Dockerfile cho một thứ bạn thật sự có. Các bài được dựng sao cho mỗi bài cải thiện đúng cái file bạn đang cầm.</span></div>
  <div class="lz-step"><span class="lz-k">Chương 7–10</span><span class="lz-t">Theo thứ tự — chúng cùng dựng nên một hệ thống</span><span class="lz-d">Chương 10 lắp ráp những thứ mà 7, 8 và 9 giới thiệu riêng lẻ. Đọc 10 trước thì vẫn được nhưng bạn sẽ phải tin rất nhiều thứ mà chưa hiểu.</span></div>
  <div class="lz-step"><span class="lz-k">Chương 11–12</span><span class="lz-t">Dạng tra cứu</span><span class="lz-d">Hãy đọc 11 TRƯỚC KHI đưa bất cứ thứ gì lên máy chủ. Mở 12 khi có thứ hỏng; nó được viết để TÌM KIẾM, không phải để học thuộc.</span></div>
</div>

<h3>Quy ước trong khoá này</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mọi khối output đều là thật</span><span class="v">Những khối nền tối được chép từ những lượt chạy thật trên Docker Engine 27 / Ubuntu 24.04, kể cả những chỗ xấu xí. Chỗ nào phiên bản có ảnh hưởng thì bài học nói rõ.</span></div>
  <div class="kv"><span class="k">Song ngữ, đặt cạnh nhau</span><span class="v">Mọi bài đều có bản tiếng Anh và tiếng Việt. Nửa tiếng Anh dùng đúng những thuật ngữ bạn sẽ gặp trong thông báo lỗi và tài liệu; nửa tiếng Việt giải thích chúng.</span></div>
  <div class="kv"><span class="k">Sơ đồ, không phải trang trí</span><span class="v">Mỗi sơ đồ tồn tại để làm hiện ra MỘT quan hệ cụ thể — các tầng ảnh chồng lên nhau, một request vượt qua ranh giới mạng, một vòng đời. Nếu một đoạn văn nói được rõ như thế thì không có sơ đồ.</span></div>
  <div class="kv"><span class="k">Mỗi bài một hộp bẫy</span><span class="v">Đúng cái lỗi mà nội dung bài đó thật sự gây ra, và cách nhận ra nó từ thông báo lỗi. Đây là những phần đáng đọc lại.</span></div>
  <div class="kv"><span class="k">Bài chấm điểm trên Code Lab</span><span class="v">Mỗi bài đều dẫn tới bài luyện của chương đó. Đọc về cache theo tầng và TẬN MẮT nhìn một lượt dựng lại tụt từ bốn phút xuống sáu giây là hai trải nghiệm khác nhau.</span></div>
</div>

<a class="link-card" href="https://docs.docker.com/get-started/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Docker — hướng dẫn Get Started chính thức</span><span class="lc-sub">Bài giới thiệu của chính nhà phát hành, cập nhật theo từng bản. Hữu ích như một giọng nói thứ hai cho Chương 1–4, và là chỗ để kiểm khi một cái cờ trong khoá này đã đổi.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/dockerfile/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Tài liệu tra cứu Dockerfile</span><span class="lc-sub">Mọi chỉ thị kèm ngữ nghĩa chính xác. Bạn sẽ quay lại đây nhiều lần — hãy đánh dấu nó ngay bây giờ thay vì đi tìm sau.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: track Docker trên Code Lab</span><span class="lc-sub">Bài chấm điểm cho mọi chương, trong một môi trường thật. Hãy bắt đầu ở đây sau Bài 0.3 và để tab đó mở suốt lúc đọc.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> học thuộc câu lệnh trước khi hiểu mô hình. Hoàn toàn có thể thuộc lòng <code>docker run -d -p 8080:80 nginx</code> rồi dùng nó trót lọt cả năm mà không biết một chữ nào trong đó nghĩa là gì — cho tới cái ngày một cổng không publish được, một volume không giữ được dữ liệu, hay một container không với tới được container khác. Mọi câu hỏi trong Chương 12 đều trả lời được trong vài giây nếu bạn giữ được mô hình của Chương 1, và không trả lời nổi nếu không có nó. Hãy cho Chương 1 một tiếng đồng hồ; nó trả lại nhiều lần con số đó.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Sản phẩm thật sự của Docker là <em>KHẢ NĂNG TÁI LẬP</em> — môi trường trở thành một phần của thứ bạn đem đi, và cả ba cú hỏng ở đầu bài này đều bắt nguồn từ việc nó KHÔNG như vậy. Một image là một hệ thống file chỉ-đọc cộng siêu dữ liệu khởi động; một container là một bản đang chạy của nó. Và một container là một TIẾN TRÌNH, không phải máy ảo — riêng sự thật đó giải thích được tốc độ, kích thước, việc dùng chung nhân với máy chủ, và phần lớn những bất ngờ.</p>
</div>
`,
    },
    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — Installing Docker, and what you actually installed|||0.2 — Cài Docker, và bạn vừa cài cái gì',
      slug: 'dk-0-2-cai-dat',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Engine với Desktop, cài trên Ubuntu bằng kho apt chính thức, nhóm docker và cái giá an ninh của nó, macOS và Windows/WSL2, kiểm tra bằng docker version, và hello-world giải thích từng dòng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Installing Docker, and what you actually installed</h2>
<p class="lead">Docker on Linux and "Docker" on macOS or Windows are not the same shape of thing, and knowing the difference explains several confusing behaviours later — why file access is slow on a Mac, why your Windows paths behave strangely, and why the same command needs <code>sudo</code> on one machine and not another.</p>

<h3>Engine, Desktop, and the alternatives</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Docker Engine (Linux)</span><span class="v">The real thing: a daemon (<code>dockerd</code>) running directly on your kernel plus a CLI that talks to it. Free, open source, no GUI. This is what runs on every server, and what this course's outputs come from.</span></div>
  <div class="kv"><span class="k">Docker Desktop (macOS / Windows)</span><span class="v">A Linux virtual machine with Engine inside it, plus a GUI and file-sharing glue. Containers are Linux processes, so a Linux kernel has to exist somewhere — on a Mac that is a VM. <strong>Requires a paid subscription for large companies</strong>; free for personal use, education and small businesses.</span></div>
  <div class="kv"><span class="k">Colima / OrbStack / Rancher Desktop</span><span class="v">macOS alternatives that provide the same VM-with-Engine without Docker Desktop's licence. <code>brew install colima docker</code> then <code>colima start</code> gives you a working <code>docker</code> CLI. OrbStack is notably faster at file sharing.</span></div>
  <div class="kv"><span class="k">Podman</span><span class="v">A daemonless, rootless-by-default alternative with a compatible CLI (<code>alias docker=podman</code> works for most of this course). Worth knowing about; the images and Dockerfiles are identical because both follow the OCI standard.</span></div>
</div>
<div class="callout"><strong>Everything in this course works on all of them</strong> except where a lesson says otherwise. Images are an open standard (OCI), so an image you build with Docker runs under Podman, containerd or Kubernetes without modification. Where the difference matters — file-sharing performance, rootless quirks — the lesson calls it out.</div>

<h3>Ubuntu / Debian: the official repository</h3>
<p>Use the apt repository, not <code>apt install docker.io</code> (Ubuntu's own package lags by a lot) and not the <code>get.docker.com</code> script (convenient, but it pipes a remote script into your shell as root and gives you no upgrade path).</p>
<pre><code><span class="tok-comment"># 1. Remove anything old and conflicting</span>
for p in docker.io docker-doc docker-compose podman-docker containerd runc; do
  sudo apt remove -y \$p 2&gt;/dev/null
done

<span class="tok-comment"># 2. Add Docker's GPG key</span>
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

<span class="tok-comment"># 3. Add the repository (reads your Ubuntu codename automatically)</span>
echo "deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \\
  https://download.docker.com/linux/ubuntu \$(. /etc/os-release &amp;&amp; echo \$VERSION_CODENAME) stable" \\
  | sudo tee /etc/apt/sources.list.d/docker.list &gt; /dev/null

<span class="tok-comment"># 4. Install</span>
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \\
  docker-buildx-plugin docker-compose-plugin</code></pre>
<div class="out">$ sudo docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
c1ec31eb5944: Pull complete
Digest: sha256:d211f485f2dd1dee407a80973c8f129f00d54604d2c90732e8e320e5038a0348
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">docker-ce</span><span class="v">The daemon, <code>dockerd</code>. This is the part that actually creates containers.</span></div>
  <div class="kv"><span class="k">docker-ce-cli</span><span class="v">The <code>docker</code> command. It is only a client — it sends HTTP requests to the daemon over a Unix socket. They can be on different machines.</span></div>
  <div class="kv"><span class="k">containerd.io</span><span class="v">The lower-level runtime the daemon delegates to. You will rarely touch it directly, but it is what actually supervises the container processes.</span></div>
  <div class="kv"><span class="k">docker-buildx-plugin</span><span class="v">The modern builder (BuildKit). Gives you build cache mounts, multi-platform builds and much better output. Chapter 5 uses it heavily — do not skip this package.</span></div>
  <div class="kv"><span class="k">docker-compose-plugin</span><span class="v">Provides <code>docker compose</code> (v2, a subcommand). Note the space: the old <code>docker-compose</code> with a hyphen is the deprecated Python v1 and behaves differently.</span></div>
</div>

<h3>Running without sudo — and what it costs</h3>
<pre><code>sudo usermod -aG docker \$USER      <span class="tok-comment"># -aG: append, never plain -G</span>
newgrp docker                      <span class="tok-comment"># or log out and back in</span>
docker run hello-world             <span class="tok-comment"># no sudo now</span>
id -nG</code></pre>
<div class="out">deploy adm cdrom sudo dip plugdev docker</div>
<div class="callout warn"><strong>Membership of the <code>docker</code> group is equivalent to root.</strong> This is not a warning about being careless — it is arithmetic. Anyone in that group can run <code>docker run -v /:/host -it alpine chroot /host sh</code> and get an unrestricted root shell on the machine, with no password and no <code>sudo</code> log entry. Add only people you would already give full <code>sudo</code>, and on a shared or production server prefer <code>sudo docker</code>, or set up <strong>rootless mode</strong> (<code>dockerd-rootless-setuptool.sh install</code>), which runs the whole daemon as your user inside a user namespace.</div>

<h3>macOS</h3>
<pre><code><span class="tok-comment"># Option A — Docker Desktop (GUI, easiest)</span>
brew install --cask docker         <span class="tok-comment"># then launch it once from Applications</span>

<span class="tok-comment"># Option B — Colima (no Desktop licence, CLI only)</span>
brew install colima docker docker-compose
colima start --cpu 4 --memory 8 --disk 60
docker run hello-world</code></pre>
<p>Either way, a Linux VM is doing the work. That has two consequences you will meet: the VM has its own CPU/memory/disk allocation (so <code>docker info</code> shows less RAM than your Mac has), and files shared from macOS into a container cross a virtualisation boundary, which is <strong>slow</strong> — noticeably so for a <code>node_modules</code> with 40,000 files. Chapter 7 covers how to avoid paying that cost.</p>

<h3>Windows: use WSL2, and live inside it</h3>
<pre><code><span class="tok-comment"># In PowerShell as Administrator</span>
wsl --install -d Ubuntu-24.04
wsl --set-default-version 2
<span class="tok-comment"># Then install Docker Desktop and enable "Use the WSL 2 based engine"</span>
<span class="tok-comment"># Settings → Resources → WSL Integration → enable your distro</span></code></pre>
<pre><code><span class="tok-comment"># Inside the Ubuntu terminal, verify you are on the Linux filesystem</span>
pwd
docker run --rm alpine echo ok</code></pre>
<div class="out">/home/cuong/projects/app
ok</div>
<div class="pitfall"><strong>Pitfall:</strong> keeping your project on <code>C:\\Users\\…</code> and reaching it from WSL through <code>/mnt/c/</code>. Every file read then crosses the Windows–Linux filesystem bridge, and an <code>npm install</code> that takes 20 seconds natively can take four minutes. Symptoms include hot reload that never fires (inotify does not work across the bridge) and builds that are inexplicably slow. Keep the repository inside the WSL filesystem — <code>/home/&lt;you&gt;/projects/…</code>, which is what <code>pwd</code> above shows — and open it with VS Code's WSL remote extension. This single change is usually a 10× improvement.</div>

<h3>Verify, and read what it tells you</h3>
<pre><code>docker version
docker info | head -25
docker compose version
docker buildx version</code></pre>
<div class="out">Client: Docker Engine - Community
 Version:           27.3.1
 API version:       1.47
 Context:           default

Server: Docker Engine - Community
 Engine:
  Version:          27.3.1
  API version:      1.47 (minimum version 1.24)
  OS/Arch:          linux/amd64
 containerd:
  Version:          1.7.22</div>
<p>Two sections, Client and Server, because they are two programs. If the Server section is missing and you see <code>Cannot connect to the Docker daemon at unix:///var/run/docker.sock</code>, the CLI is fine and the daemon is not running — <code>sudo systemctl status docker</code>, and on macOS/Windows, start Docker Desktop or <code>colima start</code>.</p>
<pre><code>docker info --format '{{.OperatingSystem}} · {{.Architecture}} · {{.NCPU}} CPU · {{.MemTotal}}'
docker info --format '{{.DockerRootDir}}'      <span class="tok-comment"># where images and volumes live</span>
docker system df                               <span class="tok-comment"># how much space that is using</span></code></pre>
<div class="out">Ubuntu 24.04.1 LTS · x86_64 · 8 CPU · 16606552064
/var/lib/docker
TYPE            TOTAL   ACTIVE   SIZE      RECLAIMABLE
Images          12      3        4.211GB   3.102GB (73%)
Containers      5       2        112.4MB   98.11MB (87%)
Local Volumes   4       2        1.844GB   602.1MB (32%)
Build Cache     87      0        2.409GB   2.409GB</div>
<div class="callout ok"><strong>Note <code>DockerRootDir</code> now.</strong> Everything Docker stores — every image layer, every volume, every build cache entry — lives under that path, which on a default Linux install is <code>/var/lib/docker</code> on your root filesystem. It grows quietly and steadily; <code>docker system df</code> is the command that tells you how much, and Chapter 11 covers reclaiming it before a full disk takes a database down.</div>

<h3>hello-world, line by line</h3>
<p>The output you ran above is a five-step story, and every step is something you will do deliberately later:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Unable to find image locally</span><span class="lz-t">the CLI asked the daemon; the daemon checked its local store</span><span class="lz-d">Images are cached on the machine. The second run of this command prints none of these lines because nothing needs fetching.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Pulling from library/hello-world</span><span class="lz-t">Docker Hub, the default registry</span><span class="lz-d"><code>hello-world</code> is shorthand for <code>docker.io/library/hello-world:latest</code>. Chapter 3 unpacks that name — it has four parts and every one matters.</span></div>
  <div class="lz-step"><span class="lz-k">3 · c1ec31eb5944: Pull complete</span><span class="lz-t">one layer downloaded</span><span class="lz-d">Images are made of stacked layers, each with its own hash. A bigger image prints many of these lines, and layers you already have are skipped — the mechanism behind Chapter 5's fast builds.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Digest: sha256:d211f485…</span><span class="lz-t">the content-addressable identity</span><span class="lz-d">This hash IS the image. Tags like <code>:latest</code> move; a digest never does. Chapter 3 explains why production should pin one.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Hello from Docker!</span><span class="lz-t">a container ran, printed, and exited</span><span class="lz-d">It still exists in a stopped state — <code>docker ps -a</code> shows it. Chapter 1 covers that lifecycle, and why stopped containers pile up if you never pass <code>--rm</code>.</span></div>
</div>
<pre><code>docker ps -a --format 'table {{.Names}}\\t{{.Image}}\\t{{.Status}}'
docker images
docker rm \$(docker ps -aq --filter ancestor=hello-world)    <span class="tok-comment"># clean up</span></code></pre>
<div class="out">NAMES              IMAGE         STATUS
elegant_darwin     hello-world   Exited (0) 2 minutes ago
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
hello-world   latest    d2c94e258dcb   14 months ago  13.3kB</div>

<a class="link-card" href="https://docs.docker.com/engine/install/ubuntu/" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Install Docker Engine on Ubuntu</span><span class="lc-sub">The canonical instructions, kept current. If the commands above ever drift from reality, this page is the source of truth — and it has the equivalents for Debian, Fedora, RHEL and Arch.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/security/rootless/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">Rootless mode</span><span class="lc-sub">Running the whole daemon as an unprivileged user. The right answer for shared machines and CI runners, with an honest list of the limitations (ports below 1024, some storage drivers).</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/filesystems" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">WSL — working across filesystems</span><span class="lc-sub">Microsoft's own explanation of why <code>/mnt/c</code> is slow and where to keep your files. Read it once if you develop on Windows; it saves hours a week.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: verify your setup</span><span class="lc-sub">Graded exercises: read a <code>docker version</code> output and say what is wrong, interpret <code>docker system df</code>, and explain why one machine needs <code>sudo</code> and another does not.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>docker-compose</code> (hyphen) versus <code>docker compose</code> (space). The hyphenated command is Compose v1, written in Python, unmaintained since 2023, and different in real ways — it names containers with underscores, does not support <code>profiles</code> or <code>include</code>, and handles <code>depends_on</code> conditions differently. If a tutorial's Compose file "does not work", check which one you are running: <code>docker compose version</code> should say v2.x. On Ubuntu, installing <code>docker-compose-plugin</code> as above gives you v2 and you should delete any v1 binary you find.</div>
<p class="note-ct"><strong>Three things to remember.</strong> The <code>docker</code> command is only a client — the daemon does the work, which is why <code>docker version</code> prints two sections and why "cannot connect to the Docker daemon" is never a CLI problem. Adding yourself to the <code>docker</code> group is granting root, so do it on your laptop and think twice on a server. And on macOS and Windows there is a Linux VM in the middle: keep your files on the Linux side of it, or you will pay for the crossing on every single file read.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cài Docker, và bạn vừa cài cái gì</h2>
<p class="lead">Docker trên Linux và "Docker" trên macOS hay Windows không cùng một hình hài, và biết được khác biệt đó giải thích được vài hành vi khó hiểu về sau — vì sao truy cập file chậm trên máy Mac, vì sao đường dẫn Windows của bạn cư xử lạ lùng, và vì sao cùng một câu lệnh mà máy này cần <code>sudo</code> còn máy kia thì không.</p>

<h3>Engine, Desktop, và các lựa chọn khác</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Docker Engine (Linux)</span><span class="v">Bản thật: một tiến trình nền (<code>dockerd</code>) chạy thẳng trên nhân của bạn cộng một CLI nói chuyện với nó. Miễn phí, mã nguồn mở, không giao diện đồ hoạ. Đây là thứ chạy trên mọi máy chủ, và là chỗ mọi output trong khoá này đến từ.</span></div>
  <div class="kv"><span class="k">Docker Desktop (macOS / Windows)</span><span class="v">Một máy ảo Linux có Engine bên trong, cộng giao diện đồ hoạ và phần keo chia sẻ file. Container là tiến trình Linux, nên phải có một cái nhân Linux ở đâu đó — trên máy Mac thì đó là một máy ảo. <strong>Cần thuê bao trả phí với công ty lớn</strong>; miễn phí cho cá nhân, giáo dục và doanh nghiệp nhỏ.</span></div>
  <div class="kv"><span class="k">Colima / OrbStack / Rancher Desktop</span><span class="v">Các lựa chọn trên macOS cho cùng mô hình máy-ảo-có-Engine mà không cần giấy phép của Docker Desktop. <code>brew install colima docker</code> rồi <code>colima start</code> là bạn có một CLI <code>docker</code> chạy được. OrbStack nhanh hơn hẳn ở khoản chia sẻ file.</span></div>
  <div class="kv"><span class="k">Podman</span><span class="v">Một lựa chọn không tiến trình nền, mặc định chạy không cần root, với CLI tương thích (<code>alias docker=podman</code> chạy được cho phần lớn khoá này). Đáng biết; ảnh và Dockerfile thì giống hệt vì cả hai đều theo chuẩn OCI.</span></div>
</div>
<div class="callout"><strong>Mọi thứ trong khoá này chạy được trên tất cả chúng</strong> trừ chỗ nào bài học nói khác. Image là một chuẩn mở (OCI), nên một ảnh bạn dựng bằng Docker chạy được dưới Podman, containerd hay Kubernetes mà không phải sửa gì. Chỗ nào khác biệt có ảnh hưởng — hiệu năng chia sẻ file, những chỗ khó chịu của chế độ không-root — bài học đều nói rõ.</div>

<h3>Ubuntu / Debian: kho apt chính thức</h3>
<p>Hãy dùng kho apt, đừng dùng <code>apt install docker.io</code> (gói của chính Ubuntu tụt hậu rất xa) và cũng đừng dùng script <code>get.docker.com</code> (tiện, nhưng nó đổ một script từ xa vào shell của bạn dưới quyền root và không cho bạn đường nâng cấp nào).</p>
<pre><code><span class="tok-comment"># 1. Gỡ mọi thứ cũ và xung đột</span>
for p in docker.io docker-doc docker-compose podman-docker containerd runc; do
  sudo apt remove -y \$p 2&gt;/dev/null
done

<span class="tok-comment"># 2. Thêm khoá GPG của Docker</span>
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

<span class="tok-comment"># 3. Thêm kho (tự đọc tên mã bản Ubuntu của bạn)</span>
echo "deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \\
  https://download.docker.com/linux/ubuntu \$(. /etc/os-release &amp;&amp; echo \$VERSION_CODENAME) stable" \\
  | sudo tee /etc/apt/sources.list.d/docker.list &gt; /dev/null

<span class="tok-comment"># 4. Cài</span>
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \\
  docker-buildx-plugin docker-compose-plugin</code></pre>
<div class="out">$ sudo docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
c1ec31eb5944: Pull complete
Digest: sha256:d211f485f2dd1dee407a80973c8f129f00d54604d2c90732e8e320e5038a0348
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">docker-ce</span><span class="v">Tiến trình nền, <code>dockerd</code>. Đây là phần thật sự tạo ra container.</span></div>
  <div class="kv"><span class="k">docker-ce-cli</span><span class="v">Câu lệnh <code>docker</code>. Nó chỉ là một MÁY KHÁCH — nó gửi yêu cầu HTTP tới tiến trình nền qua một socket Unix. Hai thứ đó có thể nằm trên hai máy khác nhau.</span></div>
  <div class="kv"><span class="k">containerd.io</span><span class="v">Bộ chạy ở tầng thấp hơn mà tiến trình nền uỷ thác cho. Bạn hiếm khi đụng thẳng vào nó, nhưng chính nó mới là thứ giám sát các tiến trình container.</span></div>
  <div class="kv"><span class="k">docker-buildx-plugin</span><span class="v">Bộ dựng hiện đại (BuildKit). Cho bạn cache mount lúc dựng, dựng đa nền tảng và output dễ đọc hơn nhiều. Chương 5 dùng nó rất nhiều — đừng bỏ gói này.</span></div>
  <div class="kv"><span class="k">docker-compose-plugin</span><span class="v">Cung cấp <code>docker compose</code> (v2, một lệnh con). Chú ý cái dấu cách: <code>docker-compose</code> cũ có dấu gạch nối là bản Python v1 đã ngừng phát triển và hành xử khác.</span></div>
</div>

<h3>Chạy không cần sudo — và cái giá của nó</h3>
<pre><code>sudo usermod -aG docker \$USER      <span class="tok-comment"># -aG: nối thêm, đừng bao giờ -G trần</span>
newgrp docker                      <span class="tok-comment"># hoặc đăng xuất rồi vào lại</span>
docker run hello-world             <span class="tok-comment"># giờ khỏi sudo</span>
id -nG</code></pre>
<div class="out">deploy adm cdrom sudo dip plugdev docker</div>
<div class="callout warn"><strong>Nằm trong nhóm <code>docker</code> TƯƠNG ĐƯƠNG với root.</strong> Đây không phải một lời nhắc nhở về sự cẩu thả — đây là phép tính. Bất cứ ai trong nhóm đó đều chạy được <code>docker run -v /:/host -it alpine chroot /host sh</code> và có ngay một shell root không hạn chế trên máy, không cần mật khẩu và không để lại dòng log <code>sudo</code> nào. Chỉ thêm những người mà bạn vốn đã sẵn sàng cấp <code>sudo</code> đầy đủ, và trên một máy chủ dùng chung hay production thì nên dùng <code>sudo docker</code>, hoặc dựng <strong>chế độ rootless</strong> (<code>dockerd-rootless-setuptool.sh install</code>) — nó chạy trọn tiến trình nền dưới danh nghĩa người dùng của bạn bên trong một user namespace.</div>

<h3>macOS</h3>
<pre><code><span class="tok-comment"># Cách A — Docker Desktop (có giao diện, dễ nhất)</span>
brew install --cask docker         <span class="tok-comment"># rồi mở nó một lần từ Applications</span>

<span class="tok-comment"># Cách B — Colima (không cần giấy phép Desktop, chỉ dòng lệnh)</span>
brew install colima docker docker-compose
colima start --cpu 4 --memory 8 --disk 60
docker run hello-world</code></pre>
<p>Kiểu nào thì cũng có một máy ảo Linux đang làm việc. Điều đó dẫn tới hai hệ quả bạn sẽ gặp: máy ảo có phần CPU/bộ nhớ/đĩa được cấp riêng (nên <code>docker info</code> báo ít RAM hơn máy Mac của bạn có), và những file chia sẻ từ macOS vào container phải vượt một ranh giới ảo hoá, và điều đó <strong>CHẬM</strong> — chậm thấy rõ với một thư mục <code>node_modules</code> chứa 40.000 file. Chương 7 nói cách tránh trả cái giá đó.</p>

<h3>Windows: dùng WSL2, và SỐNG bên trong nó</h3>
<pre><code><span class="tok-comment"># Trong PowerShell với quyền quản trị</span>
wsl --install -d Ubuntu-24.04
wsl --set-default-version 2
<span class="tok-comment"># Rồi cài Docker Desktop và bật "Use the WSL 2 based engine"</span>
<span class="tok-comment"># Settings → Resources → WSL Integration → bật bản phân phối của bạn</span></code></pre>
<pre><code><span class="tok-comment"># Trong terminal Ubuntu, kiểm rằng bạn đang ở hệ thống file Linux</span>
pwd
docker run --rm alpine echo ok</code></pre>
<div class="out">/home/cuong/projects/app
ok</div>
<div class="pitfall"><strong>Bẫy:</strong> để dự án ở <code>C:\\Users\\…</code> rồi với sang từ WSL qua <code>/mnt/c/</code>. Mỗi lần đọc file khi đó phải vượt cây cầu hệ thống file Windows–Linux, và một lệnh <code>npm install</code> vốn mất 20 giây khi chạy tự nhiên có thể ngốn bốn phút. Triệu chứng gồm cả hot reload không bao giờ nổ (inotify không hoạt động qua cây cầu đó) và những lượt dựng chậm khó hiểu. Hãy để kho mã BÊN TRONG hệ thống file WSL — <code>/home/&lt;bạn&gt;/projects/…</code>, đúng cái mà <code>pwd</code> ở trên hiện ra — và mở nó bằng tiện ích WSL remote của VS Code. Riêng thay đổi này thường cải thiện gấp 10 lần.</div>

<h3>Kiểm tra, và đọc xem nó nói gì</h3>
<pre><code>docker version
docker info | head -25
docker compose version
docker buildx version</code></pre>
<div class="out">Client: Docker Engine - Community
 Version:           27.3.1
 API version:       1.47
 Context:           default

Server: Docker Engine - Community
 Engine:
  Version:          27.3.1
  API version:      1.47 (minimum version 1.24)
  OS/Arch:          linux/amd64
 containerd:
  Version:          1.7.22</div>
<p>Hai phần, Client và Server, vì chúng là HAI chương trình. Nếu phần Server biến mất và bạn thấy <code>Cannot connect to the Docker daemon at unix:///var/run/docker.sock</code> thì CLI vẫn ổn và tiến trình nền đang không chạy — hãy <code>sudo systemctl status docker</code>, còn trên macOS/Windows thì khởi động Docker Desktop hoặc <code>colima start</code>.</p>
<pre><code>docker info --format '{{.OperatingSystem}} · {{.Architecture}} · {{.NCPU}} CPU · {{.MemTotal}}'
docker info --format '{{.DockerRootDir}}'      <span class="tok-comment"># nơi image và volume nằm</span>
docker system df                               <span class="tok-comment"># chỗ đó đang ngốn bao nhiêu</span></code></pre>
<div class="out">Ubuntu 24.04.1 LTS · x86_64 · 8 CPU · 16606552064
/var/lib/docker
TYPE            TOTAL   ACTIVE   SIZE      RECLAIMABLE
Images          12      3        4.211GB   3.102GB (73%)
Containers      5       2        112.4MB   98.11MB (87%)
Local Volumes   4       2        1.844GB   602.1MB (32%)
Build Cache     87      0        2.409GB   2.409GB</div>
<div class="callout ok"><strong>Hãy ghi nhớ <code>DockerRootDir</code> ngay bây giờ.</strong> Mọi thứ Docker lưu — từng tầng ảnh, từng volume, từng mẩu cache dựng — đều nằm dưới đường dẫn đó, mà trên một bản cài Linux mặc định là <code>/var/lib/docker</code> nằm trên hệ thống file gốc của bạn. Nó phình lên âm thầm và đều đặn; <code>docker system df</code> là câu lệnh cho bạn biết bao nhiêu, và Chương 11 nói cách thu hồi nó TRƯỚC KHI một cái đĩa đầy kéo sập cơ sở dữ liệu.</div>

<h3>hello-world, từng dòng một</h3>
<p>Cái output bạn vừa chạy ở trên là một câu chuyện năm bước, và mỗi bước đều là thứ bạn sẽ chủ động làm về sau:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Unable to find image locally</span><span class="lz-t">CLI hỏi tiến trình nền; tiến trình nền tra kho cục bộ</span><span class="lz-d">Image được lưu sẵn trên máy. Lần chạy thứ hai của câu lệnh này không in dòng nào trong số này vì chẳng còn gì phải tải.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Pulling from library/hello-world</span><span class="lz-t">Docker Hub, registry mặc định</span><span class="lz-d"><code>hello-world</code> là viết tắt của <code>docker.io/library/hello-world:latest</code>. Chương 3 mổ xẻ cái tên đó — nó có bốn phần và phần nào cũng quan trọng.</span></div>
  <div class="lz-step"><span class="lz-k">3 · c1ec31eb5944: Pull complete</span><span class="lz-t">một tầng đã tải xong</span><span class="lz-d">Image được ghép từ các TẦNG chồng lên nhau, mỗi tầng một mã băm riêng. Một ảnh lớn hơn in ra nhiều dòng kiểu này, và những tầng bạn đã có thì được bỏ qua — chính là cơ chế đứng sau những lượt dựng nhanh của Chương 5.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Digest: sha256:d211f485…</span><span class="lz-t">danh tính theo nội dung</span><span class="lz-d">Cái mã băm này CHÍNH LÀ cái ảnh. Những tag như <code>:latest</code> thì DI CHUYỂN; một digest thì không bao giờ. Chương 3 giải thích vì sao production nên ghim một cái.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Hello from Docker!</span><span class="lz-t">một container đã chạy, in ra, rồi thoát</span><span class="lz-d">Nó vẫn còn tồn tại ở trạng thái đã dừng — <code>docker ps -a</code> cho thấy nó. Chương 1 nói về vòng đời đó, và vì sao container đã dừng chất đống nếu bạn không bao giờ truyền <code>--rm</code>.</span></div>
</div>
<pre><code>docker ps -a --format 'table {{.Names}}\\t{{.Image}}\\t{{.Status}}'
docker images
docker rm \$(docker ps -aq --filter ancestor=hello-world)    <span class="tok-comment"># dọn dẹp</span></code></pre>
<div class="out">NAMES              IMAGE         STATUS
elegant_darwin     hello-world   Exited (0) 2 minutes ago
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
hello-world   latest    d2c94e258dcb   14 months ago  13.3kB</div>

<a class="link-card" href="https://docs.docker.com/engine/install/ubuntu/" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Cài Docker Engine trên Ubuntu</span><span class="lc-sub">Hướng dẫn chuẩn, luôn được cập nhật. Nếu mấy câu lệnh ở trên có lệch khỏi thực tế thì trang này là nguồn sự thật — và nó có bản tương đương cho Debian, Fedora, RHEL và Arch.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/security/rootless/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">Chế độ rootless</span><span class="lc-sub">Chạy trọn tiến trình nền dưới một người dùng không đặc quyền. Câu trả lời đúng cho máy dùng chung và máy chạy CI, kèm một danh sách trung thực các hạn chế (cổng dưới 1024, vài trình lưu trữ).</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/filesystems" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">WSL — làm việc xuyên hệ thống file</span><span class="lc-sub">Giải thích của chính Microsoft về việc vì sao <code>/mnt/c</code> chậm và nên để file ở đâu. Đọc một lần nếu bạn lập trình trên Windows; nó tiết kiệm cho bạn vài giờ mỗi tuần.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: kiểm lại bản cài của bạn</span><span class="lc-sub">Bài chấm điểm: đọc một output <code>docker version</code> rồi nói xem sai ở đâu, diễn giải <code>docker system df</code>, và giải thích vì sao máy này cần <code>sudo</code> còn máy kia thì không.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>docker-compose</code> (gạch nối) so với <code>docker compose</code> (dấu cách). Lệnh có gạch nối là Compose v1, viết bằng Python, ngừng bảo trì từ 2023, và khác biệt theo những cách có thật — nó đặt tên container bằng gạch dưới, không hỗ trợ <code>profiles</code> hay <code>include</code>, và xử lý điều kiện <code>depends_on</code> khác đi. Nếu một file Compose trong bài hướng dẫn nào đó "không chạy", hãy kiểm xem bạn đang chạy cái nào: <code>docker compose version</code> phải nói v2.x. Trên Ubuntu, cài <code>docker-compose-plugin</code> như ở trên là bạn có v2, và nên xoá mọi tệp nhị phân v1 bạn tìm thấy.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Câu lệnh <code>docker</code> chỉ là một máy khách — tiến trình nền mới làm việc, đó là lý do <code>docker version</code> in ra hai phần và là lý do "cannot connect to the Docker daemon" chưa bao giờ là lỗi của CLI. Thêm mình vào nhóm <code>docker</code> là cấp quyền root, nên cứ làm trên laptop và hãy nghĩ hai lần trên máy chủ. Và trên macOS với Windows thì có một máy ảo Linux nằm ở giữa: hãy giữ file của bạn ở phía Linux của nó, không thì bạn trả giá cho cú vượt biên đó ở MỌI lần đọc file.</p>
</div>
`,
    },
    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — Your first five minutes: run something real|||0.3 — Năm phút đầu tiên: chạy một thứ có thật',
      slug: 'dk-0-3-nam-phut',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dựng một web server và một cơ sở dữ liệu trong hai câu lệnh, nhìn vào bên trong, thay nội dung nó phục vụ, xoá sạch dấu vết, và dùng container như một công cụ vứt đi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Your first five minutes: run something real</h2>
<p class="lead">Nothing about Docker makes sense in the abstract. This lesson is a guided tour with your hands on the keyboard: a real web server, a real database, a look inside both, and a clean machine at the end. Every command here is explained properly in Chapters 1–3 — right now the point is to see what the thing does.</p>

<h3>A web server, in one command</h3>
<pre><code>docker run -d --name web -p 8080:80 nginx:1.27-alpine
curl -s localhost:8080 | head -5</code></pre>
<div class="out">Unable to find image 'nginx:1.27-alpine' locally
1.27-alpine: Pulling from library/nginx
43c4264eed91: Pull complete
1ba4d4a91ce4: Pull complete
Digest: sha256:41523187cf7d7a2f2677a80609d9caa14388bf5c1fbca9c410ba3de602aaaab4
Status: Downloaded newer image for nginx:1.27-alpine
8c40e93b1a41d2f3c1bd7b6c2e6f4a9c9b8f2d1e5a3c7d9e0b1f2a3c4d5e6f70

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Welcome to nginx!&lt;/title&gt;</div>
<p>Roughly eight seconds, and you have a production-grade web server running. Notice what you did <em>not</em> do: no <code>apt install nginx</code>, no configuration file, no <code>systemctl</code>, no decision about which version your distribution happens to package. And the long hex string is the container's full ID — the machine is now running a process it did not have thirty seconds ago.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">-d</span><span class="v">Detached: run in the background and give me my prompt back. Without it, nginx's output takes over your terminal and Ctrl-C stops the container.</span></div>
  <div class="kv"><span class="k">--name web</span><span class="v">A name you choose, instead of the random one Docker generates (<code>elegant_darwin</code>). Every later command can use it, and names must be unique on the machine.</span></div>
  <div class="kv"><span class="k">-p 8080:80</span><span class="v">Publish: traffic arriving on <strong>host</strong> port 8080 is forwarded to port <strong>80 inside</strong> the container. The order is <code>host:container</code> and getting it backwards is Chapter 8's most common mistake.</span></div>
  <div class="kv"><span class="k">nginx:1.27-alpine</span><span class="v">The image name and its tag. Pinning <code>1.27-alpine</code> rather than taking <code>latest</code> means this command will still do the same thing next year — Chapter 3 explains why that matters more than it sounds.</span></div>
</div>

<h3>Look at what is running</h3>
<pre><code>docker ps
docker logs web | tail -3
docker stats --no-stream web</code></pre>
<div class="out">CONTAINER ID   IMAGE               COMMAND                  STATUS         PORTS                                   NAMES
8c40e93b1a41   nginx:1.27-alpine   "/docker-entrypoint.…"   Up 2 minutes   0.0.0.0:8080-&gt;80/tcp, [::]:8080-&gt;80/tcp   web

172.17.0.1 - - [22/Aug/2026:20:14:07 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/8.5.0"

CONTAINER ID   NAME   CPU %     MEM USAGE / LIMIT     MEM %     NET I/O       BLOCK I/O
8c40e93b1a41   web    0.00%     3.629MiB / 15.46GiB   0.02%     1.02kB/126B   0B/0B</div>
<p>3.6MB of memory for a running web server, and the log line from your own <code>curl</code>. Note the client address: <code>172.17.0.1</code>, not <code>127.0.0.1</code> — from inside the container, your host machine is a different computer on a small private network. That is Chapter 8, and it is the reason a container cannot reach your local database at <code>localhost</code>.</p>

<h3>Go inside</h3>
<pre><code>docker exec -it web sh</code></pre>
<div class="out">/ # ls /
bin  dev  docker-entrypoint.d  etc  home  lib  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
/ # cat /etc/os-release | head -2
NAME="Alpine Linux"
ID=alpine
/ # ps aux
PID   USER     TIME  COMMAND
    1 root      0:00 nginx: master process nginx -g daemon off;
   31 nginx     0:00 nginx: worker process
   39 root      0:00 sh
   45 root      0:00 ps aux
/ # exit</div>
<p>A complete Alpine Linux filesystem, and a process table with <strong>four entries</strong>. That is the single most illuminating output in this lesson. A virtual machine running nginx would show a hundred processes — an init system, a logger, a cron daemon, an SSH server. A container shows only the processes you asked for, because it is not a machine. It is a process (PID 1 here is nginx itself) with a private view of the filesystem, the network and the process table.</p>
<pre><code><span class="tok-comment"># From the HOST, the same process is visible — with a different PID</span>
ps -eo pid,comm,args | grep 'nginx: master' | head -2
docker top web</code></pre>
<div class="out">  40122 nginx           nginx: master process nginx -g daemon off;
UID     PID    PPID   C   STIME   TTY   TIME       CMD
root    40122  40100  0   20:12   ?     00:00:00   nginx: master process nginx -g daemon off;</div>
<div class="callout ok"><strong>This is the whole idea in one observation.</strong> PID 1 inside the container and PID 40122 on the host are <em>the same process</em>. Nothing is emulated, nothing is virtualised, and there is no second kernel — the process simply has its own view of what exists. Chapter 1 names the mechanism (namespaces) and shows you where the boundary is drawn.</div>

<h3>Change what it serves</h3>
<pre><code>echo '&lt;h1&gt;Hello from a container&lt;/h1&gt;' &gt; index.html
docker rm -f web
docker run -d --name web -p 8080:80 \\
  -v "\$PWD/index.html:/usr/share/nginx/html/index.html:ro" \\
  nginx:1.27-alpine
curl -s localhost:8080</code></pre>
<div class="out">&lt;h1&gt;Hello from a container&lt;/h1&gt;</div>
<p><code>-v host_path:container_path:ro</code> is a <strong>bind mount</strong>: a file on your machine appears at that path inside the container, read-only. Edit <code>index.html</code> in your editor, refresh the browser, and the change is already there — no rebuild, no restart. This is how local development works, and Chapter 7 covers the details, including the file-permission problem it creates on Linux.</p>

<h3>A database, also in one command</h3>
<pre><code>docker run -d --name db \\
  -e POSTGRES_PASSWORD=devpass \\
  -e POSTGRES_DB=app_dev \\
  -p 5432:5432 \\
  postgres:16-alpine

sleep 5
docker exec -it db psql -U postgres -d app_dev -c 'select version();'</code></pre>
<div class="out">                                                 version
---------------------------------------------------------------------------------------------------------
 PostgreSQL 16.4 on x86_64-pc-linux-musl, compiled by gcc (Alpine 13.2.1_git20240309) 13.2.1 20240309, 64-bit
(1 row)</div>
<p>PostgreSQL 16, configured, initialised, with a database created and a password set — from one command, with nothing installed on your machine. Try that again with <code>postgres:14-alpine</code> and a different name and port, and you have two major versions running side by side without a version manager or a conflict. That is the isolation point from Lesson 0.1, demonstrated.</p>
<div class="callout warn"><strong>That database's data does not survive.</strong> Delete the container and everything in it is gone, because a container's writable layer dies with it. For a five-minute experiment that is exactly what you want. For anything you care about you need a <strong>volume</strong>, which is Chapter 7 — and forgetting it is the most expensive beginner mistake in this course, so it gets a whole chapter.</div>

<h3>Containers as disposable tools</h3>
<p>You do not need to install a language to use one. <code>--rm</code> deletes the container the moment it exits, so these leave nothing behind at all:</p>
<pre><code><span class="tok-comment"># Run a Node one-liner without Node installed</span>
docker run --rm node:22-alpine node -e 'console.log(process.version, 2**32)'

<span class="tok-comment"># A Python REPL, gone when you exit</span>
docker run --rm -it python:3.12-alpine python

<span class="tok-comment"># Format JSON with jq, on a machine that has no jq</span>
echo '{"b":2,"a":1}' | docker run --rm -i ghcr.io/jqlang/jq -S .

<span class="tok-comment"># A throwaway Linux shell to try something dangerous in</span>
docker run --rm -it alpine sh</code></pre>
<div class="out">v22.11.0 4294967296
{
  "a": 1,
  "b": 2
}</div>

<h3>Clean up completely</h3>
<pre><code>docker rm -f web db                  <span class="tok-comment"># -f stops them first</span>
docker ps -a
docker images
docker system df</code></pre>
<div class="out">CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
REPOSITORY    TAG          IMAGE ID       CREATED       SIZE
nginx         1.27-alpine  b4e5c0a1d2f3   3 weeks ago   52.5MB
postgres      16-alpine    9a1c8e7d6b5a   3 weeks ago   274MB
hello-world   latest       d2c94e258dcb   14 months ago 13.3kB</div>
<p>No containers, and your machine is exactly as it was — except for the images, which stay cached so the next <code>docker run nginx:1.27-alpine</code> is instant. That cache is not free: it is the <code>/var/lib/docker</code> from Lesson 0.2, and Chapter 11 covers pruning it. For now, <code>docker system prune</code> reclaims everything not in use.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">You installed nothing</span><span class="lz-t">no nginx, no PostgreSQL, no Node, no Python, no jq</span><span class="lz-d">All of them ran; none of them touched your system's package manager or left a config file behind.</span></div>
  <div class="lz-step"><span class="lz-k">You ran two servers</span><span class="lz-t">and they used about 40MB of memory between them</span><span class="lz-d">Because they are processes, not machines. There was no second operating system to boot.</span></div>
  <div class="lz-step"><span class="lz-k">You looked inside one</span><span class="lz-t">and found a full Linux filesystem with four processes</span><span class="lz-d">The filesystem comes from the image; the short process list is the boundary. That contrast is the mental model.</span></div>
  <div class="lz-step"><span class="lz-k">You changed what it served</span><span class="lz-t">with a bind mount, no rebuild</span><span class="lz-d">The development workflow of Chapters 7 and 10, in one flag.</span></div>
  <div class="lz-step"><span class="lz-k">You deleted it all</span><span class="lz-t">and the machine is clean</span><span class="lz-d">Disposability. This is what makes experimenting cheap, and it is worth doing deliberately while you learn.</span></div>
</div>

<a class="link-card" href="https://hub.docker.com/_/nginx" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">nginx on Docker Hub</span><span class="lc-sub">The official image's own documentation: available tags, where the config lives, how to mount your own. Every official image has a page like this and reading it saves guessing.</span></span>
</a>
<a class="link-card" href="https://hub.docker.com/_/postgres" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">postgres on Docker Hub</span><span class="lc-sub">Every <code>POSTGRES_*</code> environment variable, the initialisation-script directory, and exactly which path holds the data. You will come back to this in Chapter 7.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: your first containers</span><span class="lc-sub">Graded exercises: publish a port and prove it works, find the process on the host that corresponds to PID 1 inside, serve your own file with a bind mount, and leave the machine clean.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>docker: Error response from daemon: Bind for 0.0.0.0:8080 failed: port is already allocated</code>. It means something else already holds host port 8080 — usually a container you forgot, since a stopped container still owns its name and a running one still owns its port. <code>docker ps -a</code> to see it, <code>docker rm -f &lt;name&gt;</code> to remove it, or just publish a different host port: <code>-p 8081:80</code> works and changes nothing inside the container. If <code>docker ps -a</code> is empty, the port belongs to a normal process on your machine — <code>sudo ss -tlnp | grep 8080</code> names it.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>docker run</code> pulled an image, created a container and started it — three steps that Chapter 1 separates, and knowing they are separate explains most of the CLI. <code>docker exec -it &lt;name&gt; sh</code> is the command you will use most while learning, because looking inside answers questions no amount of reading will. And a container's writable layer dies with the container: fine for experiments, disastrous for a database, which is why Chapter 7 exists.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Năm phút đầu tiên: chạy một thứ có thật</h2>
<p class="lead">Không có gì về Docker có nghĩa khi nói trừu tượng. Bài này là một chuyến đi có hướng dẫn với tay bạn đặt lên bàn phím: một web server thật, một cơ sở dữ liệu thật, một cú nhìn vào bên trong cả hai, và một cái máy sạch sẽ ở cuối. Mọi câu lệnh ở đây đều được giải thích tử tế trong Chương 1–3 — ngay lúc này điểm mấu chốt là NHÌN THẤY cái thứ đó làm được gì.</p>

<h3>Một web server, bằng một câu lệnh</h3>
<pre><code>docker run -d --name web -p 8080:80 nginx:1.27-alpine
curl -s localhost:8080 | head -5</code></pre>
<div class="out">Unable to find image 'nginx:1.27-alpine' locally
1.27-alpine: Pulling from library/nginx
43c4264eed91: Pull complete
1ba4d4a91ce4: Pull complete
Digest: sha256:41523187cf7d7a2f2677a80609d9caa14388bf5c1fbca9c410ba3de602aaaab4
Status: Downloaded newer image for nginx:1.27-alpine
8c40e93b1a41d2f3c1bd7b6c2e6f4a9c9b8f2d1e5a3c7d9e0b1f2a3c4d5e6f70

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Welcome to nginx!&lt;/title&gt;</div>
<p>Khoảng tám giây, và bạn có một web server cấp production đang chạy. Hãy để ý những gì bạn <em>KHÔNG</em> làm: không <code>apt install nginx</code>, không file cấu hình, không <code>systemctl</code>, không phải quyết định xem bản phân phối của mình tình cờ đóng gói phiên bản nào. Còn cái chuỗi hex dài kia là ID đầy đủ của container — cái máy giờ đang chạy một tiến trình mà ba mươi giây trước nó chưa có.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">-d</span><span class="v">Tách rời: chạy ở nền và trả lại dấu nhắc cho tôi. Không có nó thì output của nginx chiếm luôn terminal của bạn và Ctrl-C sẽ dừng container.</span></div>
  <div class="kv"><span class="k">--name web</span><span class="v">Một cái tên do bạn chọn, thay cho cái tên ngẫu nhiên Docker tự sinh (<code>elegant_darwin</code>). Mọi câu lệnh về sau dùng được nó, và tên phải là DUY NHẤT trên máy.</span></div>
  <div class="kv"><span class="k">-p 8080:80</span><span class="v">Publish: lưu lượng tới cổng 8080 của <strong>MÁY CHỦ</strong> được chuyển tiếp tới cổng <strong>80 BÊN TRONG</strong> container. Thứ tự là <code>máy chủ:container</code> và viết ngược nó là lỗi phổ biến nhất của Chương 8.</span></div>
  <div class="kv"><span class="k">nginx:1.27-alpine</span><span class="v">Tên ảnh và tag của nó. Ghim <code>1.27-alpine</code> thay vì lấy <code>latest</code> nghĩa là câu lệnh này sang năm vẫn làm đúng như vậy — Chương 3 giải thích vì sao điều đó quan trọng hơn nghe có vẻ.</span></div>
</div>

<h3>Nhìn xem cái gì đang chạy</h3>
<pre><code>docker ps
docker logs web | tail -3
docker stats --no-stream web</code></pre>
<div class="out">CONTAINER ID   IMAGE               COMMAND                  STATUS         PORTS                                   NAMES
8c40e93b1a41   nginx:1.27-alpine   "/docker-entrypoint.…"   Up 2 minutes   0.0.0.0:8080-&gt;80/tcp, [::]:8080-&gt;80/tcp   web

172.17.0.1 - - [22/Aug/2026:20:14:07 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/8.5.0"

CONTAINER ID   NAME   CPU %     MEM USAGE / LIMIT     MEM %     NET I/O       BLOCK I/O
8c40e93b1a41   web    0.00%     3.629MiB / 15.46GiB   0.02%     1.02kB/126B   0B/0B</div>
<p>3,6MB bộ nhớ cho một web server đang chạy, và dòng log từ chính lệnh <code>curl</code> của bạn. Chú ý địa chỉ máy khách: <code>172.17.0.1</code>, không phải <code>127.0.0.1</code> — từ BÊN TRONG container thì máy của bạn là một cái máy tính KHÁC trên một mạng riêng nhỏ. Đó là Chương 8, và đó là lý do một container không với tới được cơ sở dữ liệu cục bộ của bạn qua <code>localhost</code>.</p>

<h3>Đi vào bên trong</h3>
<pre><code>docker exec -it web sh</code></pre>
<div class="out">/ # ls /
bin  dev  docker-entrypoint.d  etc  home  lib  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
/ # cat /etc/os-release | head -2
NAME="Alpine Linux"
ID=alpine
/ # ps aux
PID   USER     TIME  COMMAND
    1 root      0:00 nginx: master process nginx -g daemon off;
   31 nginx     0:00 nginx: worker process
   39 root      0:00 sh
   45 root      0:00 ps aux
/ # exit</div>
<p>Một hệ thống file Alpine Linux hoàn chỉnh, và một bảng tiến trình có <strong>BỐN dòng</strong>. Đó là output khai sáng nhất trong cả bài này. Một máy ảo chạy nginx sẽ cho thấy cả trăm tiến trình — một hệ khởi động, một bộ ghi log, một tiến trình cron, một máy chủ SSH. Một container chỉ cho thấy những tiến trình bạn yêu cầu, vì nó KHÔNG PHẢI một cái máy. Nó là một TIẾN TRÌNH (PID 1 ở đây chính là nginx) với một tầm nhìn riêng về hệ thống file, mạng và bảng tiến trình.</p>
<pre><code><span class="tok-comment"># Từ MÁY CHỦ, vẫn thấy đúng cái tiến trình đó — với một PID khác</span>
ps -eo pid,comm,args | grep 'nginx: master' | head -2
docker top web</code></pre>
<div class="out">  40122 nginx           nginx: master process nginx -g daemon off;
UID     PID    PPID   C   STIME   TTY   TIME       CMD
root    40122  40100  0   20:12   ?     00:00:00   nginx: master process nginx -g daemon off;</div>
<div class="callout ok"><strong>Đây là toàn bộ ý tưởng gói trong một quan sát.</strong> PID 1 bên trong container và PID 40122 trên máy chủ là <em>CÙNG MỘT TIẾN TRÌNH</em>. Không có gì bị mô phỏng, không có gì bị ảo hoá, và không có cái nhân thứ hai nào — tiến trình chỉ đơn giản là có tầm nhìn riêng về những gì tồn tại. Chương 1 gọi tên cái cơ chế đó (namespace) và chỉ cho bạn thấy ranh giới được vẽ ở đâu.</div>

<h3>Đổi thứ nó phục vụ</h3>
<pre><code>echo '&lt;h1&gt;Xin chào từ một container&lt;/h1&gt;' &gt; index.html
docker rm -f web
docker run -d --name web -p 8080:80 \\
  -v "\$PWD/index.html:/usr/share/nginx/html/index.html:ro" \\
  nginx:1.27-alpine
curl -s localhost:8080</code></pre>
<div class="out">&lt;h1&gt;Xin chào từ một container&lt;/h1&gt;</div>
<p><code>-v đường_dẫn_máy_chủ:đường_dẫn_container:ro</code> là một <strong>bind mount</strong>: một file trên máy bạn hiện ra ở đường dẫn đó bên trong container, ở chế độ chỉ đọc. Sửa <code>index.html</code> trong trình soạn thảo, tải lại trình duyệt, và thay đổi đã ở đó rồi — không dựng lại, không khởi động lại. Đây là cách phát triển cục bộ hoạt động, và Chương 7 nói chi tiết, gồm cả bài toán quyền file mà nó tạo ra trên Linux.</p>

<h3>Một cơ sở dữ liệu, cũng bằng một câu lệnh</h3>
<pre><code>docker run -d --name db \\
  -e POSTGRES_PASSWORD=devpass \\
  -e POSTGRES_DB=app_dev \\
  -p 5432:5432 \\
  postgres:16-alpine

sleep 5
docker exec -it db psql -U postgres -d app_dev -c 'select version();'</code></pre>
<div class="out">                                                 version
---------------------------------------------------------------------------------------------------------
 PostgreSQL 16.4 on x86_64-pc-linux-musl, compiled by gcc (Alpine 13.2.1_git20240309) 13.2.1 20240309, 64-bit
(1 row)</div>
<p>PostgreSQL 16, đã cấu hình, đã khởi tạo, có sẵn một cơ sở dữ liệu được tạo và một mật khẩu được đặt — từ một câu lệnh, không cài gì lên máy bạn. Hãy thử lại lần nữa với <code>postgres:14-alpine</code> cùng một cái tên khác và một cổng khác, thế là bạn có hai phiên bản lớn chạy song song mà không cần trình quản lý phiên bản và không có xung đột nào. Đó chính là điểm CÔ LẬP ở Bài 0.1, được chứng minh.</p>
<div class="callout warn"><strong>Dữ liệu của cơ sở dữ liệu đó KHÔNG sống sót.</strong> Xoá container đi thì mọi thứ trong nó biến mất, vì tầng ghi được của một container chết cùng với nó. Với một thí nghiệm năm phút thì đó đúng là thứ bạn muốn. Với bất cứ thứ gì bạn quan tâm thì bạn cần một <strong>VOLUME</strong>, và đó là Chương 7 — quên nó là sai lầm đắt giá nhất của người mới trong khoá này, nên nó được cả một chương.</div>

<h3>Container như những công cụ vứt đi</h3>
<p>Bạn không cần cài một ngôn ngữ để dùng nó. <code>--rm</code> xoá container ngay khoảnh khắc nó thoát, nên mấy lệnh này không để lại gì cả:</p>
<pre><code><span class="tok-comment"># Chạy một dòng Node mà không cài Node</span>
docker run --rm node:22-alpine node -e 'console.log(process.version, 2**32)'

<span class="tok-comment"># Một REPL Python, biến mất khi bạn thoát</span>
docker run --rm -it python:3.12-alpine python

<span class="tok-comment"># Định dạng JSON bằng jq, trên một cái máy không có jq</span>
echo '{"b":2,"a":1}' | docker run --rm -i ghcr.io/jqlang/jq -S .

<span class="tok-comment"># Một shell Linux vứt đi để thử một thứ nguy hiểm</span>
docker run --rm -it alpine sh</code></pre>
<div class="out">v22.11.0 4294967296
{
  "a": 1,
  "b": 2
}</div>

<h3>Dọn sạch hoàn toàn</h3>
<pre><code>docker rm -f web db                  <span class="tok-comment"># -f dừng chúng trước</span>
docker ps -a
docker images
docker system df</code></pre>
<div class="out">CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
REPOSITORY    TAG          IMAGE ID       CREATED       SIZE
nginx         1.27-alpine  b4e5c0a1d2f3   3 weeks ago   52.5MB
postgres      16-alpine    9a1c8e7d6b5a   3 weeks ago   274MB
hello-world   latest       d2c94e258dcb   14 months ago 13.3kB</div>
<p>Không còn container nào, và cái máy của bạn y hệt như lúc đầu — trừ đám ảnh, chúng nằm lại trong bộ nhớ đệm để lần <code>docker run nginx:1.27-alpine</code> kế tiếp là tức thì. Bộ đệm đó không miễn phí: nó chính là <code>/var/lib/docker</code> ở Bài 0.2, và Chương 11 nói cách tỉa nó. Còn bây giờ thì <code>docker system prune</code> thu hồi mọi thứ không còn dùng.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bạn không cài gì cả</span><span class="lz-t">không nginx, không PostgreSQL, không Node, không Python, không jq</span><span class="lz-d">Tất cả đều đã chạy; không cái nào đụng vào trình quản lý gói của hệ thống hay để lại một file cấu hình nào.</span></div>
  <div class="lz-step"><span class="lz-k">Bạn chạy hai máy chủ</span><span class="lz-t">và cả hai cộng lại ngốn khoảng 40MB bộ nhớ</span><span class="lz-d">Bởi vì chúng là TIẾN TRÌNH, không phải máy. Không có hệ điều hành thứ hai nào phải khởi động.</span></div>
  <div class="lz-step"><span class="lz-k">Bạn nhìn vào bên trong một cái</span><span class="lz-t">và thấy một hệ thống file Linux đầy đủ với bốn tiến trình</span><span class="lz-d">Hệ thống file đến từ IMAGE; danh sách tiến trình ngắn ngủi chính là RANH GIỚI. Sự tương phản đó chính là mô hình tư duy.</span></div>
  <div class="lz-step"><span class="lz-k">Bạn đổi thứ nó phục vụ</span><span class="lz-t">bằng một bind mount, không dựng lại</span><span class="lz-d">Quy trình phát triển của Chương 7 và 10, gói trong một cái cờ.</span></div>
  <div class="lz-step"><span class="lz-k">Bạn xoá sạch tất cả</span><span class="lz-t">và cái máy trở lại sạch sẽ</span><span class="lz-d">Tính vứt-đi-được. Đây là thứ khiến việc thử nghiệm trở nên rẻ, và đáng làm một cách có chủ ý trong lúc bạn học.</span></div>
</div>

<a class="link-card" href="https://hub.docker.com/_/nginx" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">nginx trên Docker Hub</span><span class="lc-sub">Tài liệu của chính ảnh chính thức: các tag có sẵn, cấu hình nằm ở đâu, gắn cấu hình của bạn vào thế nào. Ảnh chính thức nào cũng có một trang như thế và đọc nó thì khỏi phải đoán.</span></span>
</a>
<a class="link-card" href="https://hub.docker.com/_/postgres" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">postgres trên Docker Hub</span><span class="lc-sub">Mọi biến môi trường <code>POSTGRES_*</code>, thư mục chứa script khởi tạo, và chính xác đường dẫn nào giữ dữ liệu. Bạn sẽ quay lại đây ở Chương 7.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: những container đầu tiên</span><span class="lc-sub">Bài chấm điểm: publish một cổng rồi chứng minh nó chạy, tìm tiến trình trên máy chủ ứng với PID 1 bên trong, phục vụ file của chính bạn bằng bind mount, và để lại một cái máy sạch.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>docker: Error response from daemon: Bind for 0.0.0.0:8080 failed: port is already allocated</code>. Nó nghĩa là có thứ khác đang giữ cổng 8080 của máy chủ — thường là một container bạn quên mất, vì một container đã dừng vẫn giữ TÊN của nó còn một container đang chạy vẫn giữ CỔNG của nó. <code>docker ps -a</code> để nhìn thấy nó, <code>docker rm -f &lt;tên&gt;</code> để gỡ, hoặc chỉ cần publish sang một cổng khác của máy chủ: <code>-p 8081:80</code> vẫn chạy và không đổi gì bên trong container. Nếu <code>docker ps -a</code> rỗng thì cái cổng thuộc về một tiến trình bình thường trên máy bạn — <code>sudo ss -tlnp | grep 8080</code> gọi tên nó ra.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> <code>docker run</code> đã kéo một ảnh, TẠO một container rồi KHỞI CHẠY nó — ba bước mà Chương 1 tách ra, và biết chúng tách rời được giải thích phần lớn cái CLI này. <code>docker exec -it &lt;tên&gt; sh</code> là câu lệnh bạn sẽ dùng nhiều nhất trong lúc học, vì nhìn vào bên trong trả lời được những câu hỏi mà đọc bao nhiêu cũng không xong. Và tầng ghi được của một container chết cùng container: ổn với thí nghiệm, thảm hoạ với một cơ sở dữ liệu, và đó là lý do Chương 7 tồn tại.</p>
</div>
`,
    },
    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — Quiz: getting oriented|||0.4 — Kiểm tra: định vị lại',
      slug: 'dk-0-4-quiz',
      type: 'QUIZ',
      description: 'Tám câu về image với container, container so với máy ảo, thứ tự của -p, hai phần của docker version, nhóm docker, dữ liệu chết theo container, --rm, và hệ thống file của WSL.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the model and the setup. They follow the lesson order, and every one of them matters again in Chapters 1–3.</p>
<div class="callout ok">Aim for 7/8. The two that matter most: the difference between an image and a container (0.1), and why a container is not a virtual machine (0.1 and 0.3) — every later chapter builds on those two sentences.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về mô hình và phần cài đặt. Chúng theo thứ tự bài, và câu nào cũng còn quan trọng lại ở Chương 1–3.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất: khác biệt giữa image và container (bài 0.1), và vì sao container không phải máy ảo (bài 0.1 và 0.3) — mọi chương sau đều dựng trên hai câu đó.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What is the difference between an image and a container?|||Image khác container ở chỗ nào?',
            options: [
              'They are the same thing; "image" is the older name|||Chúng là một; "image" chỉ là tên gọi cũ',
              'An image is a read-only filesystem plus the metadata to start a process in it; a container is one RUNNING instance of that image with a writable layer on top|||Image là một hệ thống file chỉ-đọc cộng siêu dữ liệu để khởi chạy một tiến trình bên trong; container là một bản ĐANG CHẠY của image đó, có thêm một tầng ghi được nằm trên',
              'An image runs on the server; a container runs on your laptop|||Image chạy trên máy chủ; container chạy trên laptop của bạn',
              'A container is a compressed image ready to be shipped|||Container là một image đã nén, sẵn sàng đem đi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Inside a running nginx container, ps aux showed only four processes, while a VM running nginx would show a hundred. Why?|||Bên trong một container nginx đang chạy, ps aux chỉ hiện bốn tiến trình, trong khi một máy ảo chạy nginx sẽ hiện cả trăm. Vì sao?',
            options: [
              'Docker hides system processes from you for security|||Docker giấu các tiến trình hệ thống đi vì lý do an ninh',
              'The container is not a machine — there is no guest kernel and no init system, only the processes you asked for, with a private view of the process table. The same process is visible on the HOST with a different PID|||Container không phải một cái máy — không có nhân khách và không có hệ khởi động, chỉ có những tiến trình bạn yêu cầu, với một tầm nhìn riêng về bảng tiến trình. Cũng tiến trình đó NHÌN THẤY ĐƯỢC trên MÁY CHỦ với một PID khác',
              'Alpine Linux is too small to run more processes|||Alpine Linux quá nhỏ để chạy thêm tiến trình',
              'The other processes are running but ps cannot see them|||Các tiến trình khác vẫn chạy nhưng ps không thấy chúng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In docker run -p 8080:80, which number is the host port and which is the container port?|||Trong docker run -p 8080:80, số nào là cổng máy chủ và số nào là cổng container?',
            options: [
              '8080 is the container port, 80 is the host port|||8080 là cổng container, 80 là cổng máy chủ',
              '8080 is the HOST port and 80 is the CONTAINER port — the order is always host:container|||8080 là cổng MÁY CHỦ còn 80 là cổng CONTAINER — thứ tự luôn là máy chủ:container',
              'Both refer to the host; the container always uses the same number|||Cả hai đều chỉ máy chủ; container luôn dùng cùng con số',
              'The order depends on whether you use -p or --publish|||Thứ tự tuỳ vào việc bạn dùng -p hay --publish',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does docker version print two separate sections, Client and Server?|||Vì sao docker version in ra hai phần riêng, Client và Server?',
            options: [
              'To show the CLI version and the newest version available online|||Để cho thấy phiên bản CLI và phiên bản mới nhất có trên mạng',
              'Because they are two programs: the docker CLI is only a client that sends requests over a socket to the dockerd daemon, which does the actual work — and they can even be on different machines|||Vì chúng là HAI chương trình: CLI docker chỉ là máy khách gửi yêu cầu qua một socket tới tiến trình nền dockerd, và tiến trình nền mới làm việc thật — hai thứ đó thậm chí nằm trên hai máy khác nhau được',
              'One is for Linux containers and one is for Windows containers|||Một cái cho container Linux và một cái cho container Windows',
              'Server refers to the registry you are logged into|||Server chỉ cái registry bạn đang đăng nhập vào',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does adding your user to the docker group actually grant?|||Thêm người dùng của bạn vào nhóm docker thật ra cấp cho họ cái gì?',
            options: [
              'Permission to run containers, but not to change the system|||Quyền chạy container, nhưng không đổi được hệ thống',
              'Effectively full root on the machine — a member can mount the host filesystem into a container and get an unrestricted root shell with no password and no sudo log entry|||Trên thực tế là quyền root đầy đủ trên máy — một thành viên có thể gắn hệ thống file của máy chủ vào một container và có ngay một shell root không hạn chế, không cần mật khẩu và không để lại dòng log sudo nào',
              'Read-only access to images but not the ability to start containers|||Quyền đọc image nhưng không khởi chạy được container',
              'Nothing on Linux; it only matters on macOS|||Không cấp gì trên Linux; nó chỉ có ý nghĩa trên macOS',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You ran a PostgreSQL container, created tables, then docker rm -f db. What happened to the data?|||Bạn chạy một container PostgreSQL, tạo vài bảng, rồi docker rm -f db. Dữ liệu ra sao?',
            options: [
              'It is kept in the image and restored when you run the container again|||Nó nằm lại trong image và được khôi phục khi bạn chạy container lần nữa',
              'It is gone — a container writes to a writable layer that is destroyed with the container; surviving that requires a volume|||Nó mất — container ghi vào một tầng ghi được, và tầng đó bị huỷ cùng container; muốn sống sót thì phải có một volume',
              'It is moved to /var/lib/docker/orphans for 30 days|||Nó được dời sang /var/lib/docker/orphans trong 30 ngày',
              'It survives because the -p flag published the data directory|||Nó sống sót vì cờ -p đã publish thư mục dữ liệu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does the --rm flag do, and when is it the right choice?|||Cờ --rm làm gì, và khi nào nó là lựa chọn đúng?',
            options: [
              'It removes the image after the run, to save disk space|||Nó xoá image sau khi chạy xong để tiết kiệm đĩa',
              'It deletes the CONTAINER as soon as it exits — right for one-off commands and throwaway tools, wrong for anything whose logs or state you may want afterwards|||Nó xoá CONTAINER ngay khi nó thoát — đúng cho những lệnh chạy một lần và công cụ vứt đi, sai với bất cứ thứ gì mà bạn có thể còn cần log hay trạng thái của nó về sau',
              'It restarts the container automatically if it crashes|||Nó tự khởi động lại container nếu container sập',
              'It removes any older container with the same name before starting|||Nó xoá mọi container cũ trùng tên trước khi khởi chạy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'On Windows with WSL2, why should your project files live under /home/you/ rather than /mnt/c/Users/you/?|||Trên Windows với WSL2, vì sao file dự án của bạn nên nằm dưới /home/bạn/ chứ không phải /mnt/c/Users/bạn/?',
            options: [
              'Docker cannot read files from /mnt/c at all|||Docker hoàn toàn không đọc được file từ /mnt/c',
              'Every file access under /mnt/c crosses the Windows–Linux filesystem bridge, which is dramatically slower and breaks inotify — so installs crawl and hot reload never fires|||Mọi lần truy cập file dưới /mnt/c đều phải vượt cây cầu hệ thống file Windows–Linux, chậm hơn rất nhiều và làm hỏng inotify — nên cài đặt thì lết còn hot reload thì không bao giờ nổ',
              'Windows locks the files so containers cannot write to them|||Windows khoá file lại nên container không ghi vào được',
              'It only matters for Docker Desktop with the Hyper-V backend|||Nó chỉ có ý nghĩa với Docker Desktop dùng nền Hyper-V',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
