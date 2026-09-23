/**
 * Docker — Chương 3: image & registry.
 * Tên ảnh · tag với digest · registry · đa kiến trúc · quản lý đĩa · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → &#36;{;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 *
 * Nâng cấp 09/2026: bài 3.0 slide (deck dk-03, 31 slide) + slide/🧪/🗂/📌 + phần đào sâu trong 3.1–3.5;
 * quiz 10 câu. Output MỚI chạy thật 23/09/2026 trên Docker Desktop 4.91 / Engine 29.8 (Mac M1, arm64) và
 * Docker Engine 29.6 (Fedora 44, amd64, KHÔNG có QEMU); registry thử là registry:2 cục bộ. Đã thay những
 * output cũ bịa/sai (digest giả, label OCI không có thật, "ảnh cũ thành <none>" khi dời tag, PG_MAJOR…).
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 3 — Images & registries|||Chương 3 — Image & registry',
  description: 'Một cái tên ảnh gồm bốn phần và phần nào cũng quan trọng. Tag di chuyển còn digest thì không. Registry nào, giới hạn tần suất ra sao, ảnh đa kiến trúc, và làm sao để /var/lib/docker không nuốt cả cái đĩa.',
  lessons: [
    /* ─────────────────────────── 3.0 ─────────────────────────── */
    {
      title: '3.0 — Chapter 3 slides: images and registries in pictures|||3.0 — Slide Chương 3: image và registry bằng hình',
      slug: 'dk-3-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 31 slide của Chương 3: bốn trường của một tên ảnh, chỉ mục và manifest, tag dời được và digest bất biến, registry là một API HTTP, giới hạn kéo Docker Hub, ảnh đa kiến trúc trên Mac và Linux, và thang dọn đĩa an toàn — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Slides</span>
<h2>The whole chapter in 31 slides</h2>
<p class="lead">Every command in this chapter answers one question: <em>which bytes am I actually running?</em> The slides answer it in pictures — a name split into its four fields, a tag pointing at an index of per-platform images, a digest computed from the bytes of a manifest, a push that uploads only what the registry lacks, a Mac image refused by a Linux server, and a cleanup ladder whose rungs get more dangerous as you climb.</p>
<p>Slides 3–7 belong to Lesson 3.1, 8–13 to 3.2, 14–18 to 3.3, 19–23 to 3.4 and 24–28 to 3.5. The last three are the chapter's common mistakes, a cheat sheet and a 40-minute practice session. Every terminal on the slides is real output, recorded on 23 September 2026 on Docker Desktop 4.91 (Mac M1, arm64) and Docker Engine 29.6 (Linux, amd64), with a local <code>registry:2</code> standing in for Docker Hub and GHCR. The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Slide</span>
<h2>Cả chương trong 31 slide</h2>
<p class="lead">Mọi câu lệnh trong chương này trả lời đúng một câu hỏi: <em>tôi thật sự đang chạy những byte nào?</em> Bộ slide trả lời bằng hình — một cái tên tách thành bốn trường, một tag trỏ vào một chỉ mục gồm các ảnh theo từng nền tảng, một digest tính ra từ chính các byte của manifest, một lượt push chỉ tải lên thứ registry còn thiếu, một ảnh dựng trên Mac bị máy chủ Linux từ chối, và một cái thang dọn đĩa mà càng leo lên càng nguy hiểm.</p>
<p>Slide 3–7 thuộc Bài 3.1, 8–13 thuộc 3.2, 14–18 thuộc 3.3, 19–23 thuộc 3.4 và 24–28 thuộc 3.5. Ba slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh và một buổi thực hành 40 phút. Mọi terminal trên slide là output THẬT, ghi ngày 23/09/2026 trên Docker Desktop 4.91 (Mac M1, arm64) và Docker Engine 29.6 (Linux, amd64), với một <code>registry:2</code> cục bộ đóng vai Docker Hub và GHCR — con số trên máy bạn có thể khác, quy luật thì không.</p>
</div>
${gallery('dk-03', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, '“nginx” là 4 trường — Docker tự điền 3'], [4, 'Dấu chấm, dấu hai chấm, localhost ⇒ registry'], [5, 'Ai chịu trách nhiệm về ảnh'],
  [6, 'Một tag trỏ tới một chỉ mục'], [7, 'Nguồn gốc nằm ở annotation, không ở label'],
  [8, 'Tag là nhãn dán dời được'], [9, 'Kéo lại một tag đã dời ⇒ ảnh mồ côi'], [10, ':latest hôm nay là Postgres 18'],
  [11, 'Digest = SHA-256 của byte manifest'], [12, 'Digest chỉ mục và digest nền tảng'], [13, 'Ghim tag@digest và chiến lược tag'],
  [14, 'Registry là một API HTTP'], [15, 'Mounted from — không tải lên lại'], [16, 'config.json chỉ là base64'],
  [17, 'Giới hạn kéo của Docker Hub'], [18, 'Gương kéo xuyên'],
  [19, 'Hai kiểu chết vì sai kiến trúc'], [20, 'Mỗi máy chọn mục khớp CPU'], [21, 'Rosetta và QEMU: cái giá mô phỏng'],
  [22, 'Docker 29 dựng đa kiến trúc và --load'], [23, 'Biên dịch chéo với BUILDPLATFORM'],
  [24, 'docker system df trên hai máy thật'], [25, 'Thang dọn đĩa'], [26, 'prune -a xoá bản quay lui'],
  [27, 'volume prune chỉ lấy volume vô danh'], [28, 'Tự động hoá phần an toàn'],
  [29, 'Sai lầm hay gặp'], [30, 'Bảng tra nhanh'], [31, 'Thực hành chương 3'],
])}
`,
    },
    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — Reading an image name|||3.1 — Đọc một cái tên ảnh',
      slug: 'dk-3-1-ten-anh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bốn phần của một tham chiếu ảnh và những mặc định ẩn, vì sao "library/" tồn tại, ảnh chính thức khác ảnh của người khác thế nào, và cách đọc một cái tên để biết mình sắp chạy cái gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Reading an image name</h2>
<p class="lead"><code>nginx</code> looks like a name. It is actually four fields with three of them left blank, and Docker fills the blanks in with defaults you never see. Knowing what those defaults are is the difference between "it pulled something" and knowing exactly what you are about to run on your server.</p>

<h3>The four parts</h3>
${slide('dk-03', 3, '“nginx” là 4 trường — Docker tự điền 3')}
<pre><code><span class="tok-comment"># The full form, with nothing left out:</span>
docker.io/library/nginx:1.27-alpine
<span class="tok-comment"># ^^^^^^^^ ^^^^^^^ ^^^^^ ^^^^^^^^^^^</span>
<span class="tok-comment"># registry namespace repo  tag</span>

docker pull nginx:1.27-alpine
docker image inspect nginx:1.27-alpine --format '{{index .RepoTags 0}}'
docker image inspect nginx:1.27-alpine --format '{{index .RepoDigests 0}}'</code></pre>
<div class="out">nginx:1.27-alpine
nginx@sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">registry — defaults to docker.io</span><span class="lz-lnote">The host serving the image. <code>ghcr.io</code>, <code>quay.io</code>, <code>registry.gitlab.com</code>, <code>123456.dkr.ecr.ap-southeast-1.amazonaws.com</code>, or your own. Docker recognises it because it contains a dot or a colon, or is exactly <code>localhost</code> — which is why <code>myregistry/app</code> without a dot is treated as a Docker Hub <em>namespace</em>, not a host.</span></div>
  <div class="lz-layer"><span class="lz-lname">namespace — defaults to library</span><span class="lz-lnote">The account or organisation. <code>library</code> is Docker's own namespace for curated official images, and it is the only one you never have to type. <code>bitnami/postgresql</code>, <code>cuonghoang1103/api</code> — those are user namespaces.</span></div>
  <div class="lz-layer"><span class="lz-lname">repository — the only mandatory part</span><span class="lz-lnote">The name of the thing: <code>nginx</code>, <code>postgres</code>, <code>node</code>. One repository holds many tags and many architectures.</span></div>
  <div class="lz-layer"><span class="lz-lname">tag — defaults to latest</span><span class="lz-lnote">A human label pointing at one image. It is a <strong>mutable pointer</strong>, not a version — Lesson 3.2 is about why that matters more than anything else in this chapter.</span></div>
  <div class="lz-layer"><span class="lz-lname">or @digest — instead of a tag</span><span class="lz-lnote"><code>nginx@sha256:6564…</code> names the content itself. Immutable by construction: that string can only ever refer to those exact bytes.</span></div>
</div>
<pre><code><span class="tok-comment"># All four of these pull the same image</span>
docker pull nginx:1.27-alpine
docker pull library/nginx:1.27-alpine
docker pull docker.io/nginx:1.27-alpine
docker pull docker.io/library/nginx:1.27-alpine
docker images nginx --format '{{.Repository}}:{{.Tag}} {{.ID}}'</code></pre>
<div class="out">nginx:alpine 72ba65eb42c1
nginx:1.27-alpine 65645c7bb6a0</div>
<p class="note-ct">Real output, re-run on the course Mac (Docker Desktop 4.91 / Engine 29.8, containerd image store). The version of this lesson written on Engine 27 printed a single made-up line here. Two things are worth noticing. The filter <code>docker images nginx</code> matches the <em>repository</em>, so every nginx tag on the machine is listed — here also <code>nginx:alpine</code>. And on Docker 29 the IMAGE ID <code>65645c7bb6a0</code> is simply the first 12 characters of the index digest <code>sha256:65645c7b…</code> that <code>RepoDigests</code> printed above: the ID and the digest are the same number (Lesson 3.2 shows why).</p>



<h3>How Docker splits a name: the dot, colon or localhost rule</h3>
${slide('dk-03', 4, 'Có dấu chấm, dấu hai chấm hay localhost ⇒ mới là registry')}
<p>Everything before the first <code>/</code> is ambiguous: it could be a registry host (<code>ghcr.io</code>) or a Docker Hub account (<code>bitnami</code>). Docker settles it with one mechanical rule — no lookup, no guessing. The first component is a <strong>registry</strong> only if it contains a <code>.</code> (a domain), contains a <code>:</code> (a port), or is exactly <code>localhost</code>. Otherwise it is a <strong>namespace</strong> on Docker Hub. A name with no <code>/</code> at all gets both defaults: registry <code>docker.io</code>, namespace <code>library</code>.</p>
<table>
<tr><th>You type</th><th>First component is…</th><th>Docker actually asks for</th></tr>
<tr><td><code>nginx</code></td><td>(nothing — no slash)</td><td><code>docker.io/library/nginx:latest</code></td></tr>
<tr><td><code>bitnami/redis:7.2</code></td><td><code>bitnami</code>: no dot, no colon ⇒ namespace</td><td><code>docker.io/bitnami/redis:7.2</code></td></tr>
<tr><td><code>myregistry/app</code></td><td><code>myregistry</code>: no dot ⇒ <strong>a Hub account</strong></td><td><code>docker.io/myregistry/app:latest</code> — almost never what you meant</td></tr>
<tr><td><code>myregistry:5000/app</code></td><td>has a colon ⇒ registry host + port</td><td><code>https://myregistry:5000/v2/app/…</code></td></tr>
<tr><td><code>ghcr.io/cuonghoang1103/api:1.4</code></td><td>has a dot ⇒ registry</td><td>GitHub Container Registry</td></tr>
<tr><td><code>localhost:18030/app</code></td><td><code>localhost</code> + port ⇒ registry</td><td>the registry running on this machine</td></tr>
<tr><td><code>NGINX</code></td><td>—</td><td>rejected: repository names must be lowercase</td></tr>
</table>
<p>You can watch each case fail in its own distinctive way (course Mac, Docker 29.8):</p>
<pre><code class="language-bash">docker pull myregistry/app
docker pull myregistry:5000/app
docker pull NGINX</code></pre>
<div class="out">Using default tag: latest
Error response from daemon: pull access denied for myregistry/app, repository does not exist or may require 'docker login'
Error response from daemon: failed to resolve reference "myregistry:5000/app:latest": failed to do request: Head "https://myregistry:5000/v2/app/manifests/latest": dialing myregistry:5000 container via direct connection because Docker Desktop has no HTTPS proxy: connecting to myregistry:5000: dial tcp: lookup myregistry: no such host
invalid reference format: repository name (library/NGINX) must be lowercase</div>
<p>Read the three errors as the rule in action. The first went to <em>Docker Hub</em> and asked for an account called <code>myregistry</code> — "pull access denied … may require docker login" is Hub's way of saying "no such repository that you can see". The second, because of the colon, went looking for a <em>host</em> called <code>myregistry</code> and failed at DNS (<code>no such host</code>), which is exactly the right failure. The third never left your machine: the name itself is invalid, and the message even shows you the expanded form <code>library/NGINX</code>.</p>
<div class="callout"><strong>Tag and digest follow the same "last separator" logic.</strong> The tag is what comes after the <em>last</em> colon of the last path component, so <code>localhost:18030/app</code> has no tag (the colon belongs to the host) and <code>localhost:18030/app:1.0</code> does. A digest is always introduced by <code>@</code>. If both are present — <code>nginx:1.27-alpine@sha256:…</code> — the digest decides which bytes you get and the tag is only a comment for humans (Lesson 3.2 proves this).</div>
<h3>Try it step by step: expand a name and prove two spellings are one image</h3>
<ol>
<li>Pull by the short name and by the fully spelled-out name. The second pull must say <em>up to date</em> — proof that both names point at the same thing:
<pre><code class="language-bash">docker pull nginx:1.27-alpine
docker pull docker.io/library/nginx:1.27-alpine</code></pre>
<div class="out">Digest: sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10
Status: Image is up to date for nginx:1.27-alpine
docker.io/library/nginx:1.27-alpine</div>
Note the last line: Docker itself prints the full reference it used.</li>
<li>Ask the image for its own names — the human tag and the content digest:
<pre><code class="language-bash">docker image inspect nginx:1.27-alpine --format '{{index .RepoTags 0}}'
docker image inspect nginx:1.27-alpine --format '{{index .RepoDigests 0}}'</code></pre></li>
<li>Ask the <em>registry</em> (no pull needed) what that name really is — an index of many platforms:
<pre><code class="language-bash">docker buildx imagetools inspect nginx:1.27-alpine | head -8</code></pre></li>
<li>Break it on purpose with <code>myregistry/app</code>, <code>myregistry:5000/app</code> and <code>NGINX</code>, and match each error to a row of the table above.</li>
</ol>
<h3>Official images and everything else</h3>
${slide('dk-03', 5, 'Phần trước dấu / cho biết ai chịu trách nhiệm về ảnh')}
<pre><code>docker pull nginx:1.27-alpine        <span class="tok-comment"># official: library namespace, no slash</span>
docker pull bitnami/nginx:latest     <span class="tok-comment"># a company's image</span>
docker pull ghcr.io/jqlang/jq:latest <span class="tok-comment"># a project's own registry</span>
docker images --format 'table {{.Repository}}\\t{{.Tag}}\\t{{.Size}}' | head -5</code></pre>
<div class="out">REPOSITORY          TAG            SIZE
nginx               1.27-alpine    52.5MB
bitnami/nginx       latest         168MB
ghcr.io/jqlang/jq   latest         5.24MB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Official images (no namespace)</span><span class="v">Reviewed by Docker, built from public Dockerfiles, rebuilt when their base gets security patches, and documented on Hub. <code>nginx</code>, <code>postgres</code>, <code>node</code>, <code>redis</code>, <code>alpine</code>. Default to these.</span></div>
  <div class="kv"><span class="k">Verified Publisher / Sponsored OSS</span><span class="v">Vendor-maintained with a badge on Hub — <code>bitnami/*</code>, <code>grafana/*</code>, <code>hashicorp/*</code>. Generally trustworthy and often more configurable than the official image, at the cost of being bigger and more opinionated.</span></div>
  <div class="kv"><span class="k">Anyone's image</span><span class="v"><code>someuser/thing</code> is an account on Docker Hub with no review whatsoever. Read its Dockerfile before you run it — and note that many popular tutorial images have not been rebuilt in three years and carry every CVE published since.</span></div>
  <div class="kv"><span class="k">A registry hostname in front</span><span class="v"><code>ghcr.io/…</code>, <code>quay.io/…</code>, <code>gcr.io/…</code>. Increasingly the norm for projects that want to avoid Docker Hub's rate limits — including the images from your own CI (Lesson 3.3).</span></div>
</div>
<div class="callout warn"><strong>Typosquatting is real.</strong> <code>node</code> is the official image; <code>nodejs</code> is somebody's account. <code>ubunut</code>, <code>pyhton</code>, <code>redsi</code> — every plausible misspelling of a popular image has been registered by someone at some point, and a container that runs as root and mounts your source directory is an excellent place to put something unpleasant. Check for the "Docker Official Image" badge on Hub, prefer no-namespace names for the well-known software, and pin a digest for anything that touches production (Lesson 3.2).</div>
<div class="pitfall co-tieu-de"><strong>A real one from 2025: the namespace owner changes the rules.</strong> In August 2025 Bitnami announced that from 28 August its free catalogue on Docker Hub would shrink to a small set of hardened images on <code>latest</code> tags, and that the versioned tags (<code>bitnami/postgresql:15</code>, <code>bitnami/redis:7.2</code>…) would move to a new, frozen namespace <code>bitnamilegacy/*</code> with no further updates — with scheduled "brownouts" in which some images were temporarily switched off, and deletion postponed to 29 September 2025. Thousands of Compose files and Helm charts that had never changed a line started failing to pull. Nothing about the <em>name</em> warned anybody: <code>bitnami/…</code> looked exactly as trustworthy the day before. The lesson for your own files: a namespace belongs to somebody, and what they publish under it is their decision. Prefer official images for the common services, and know which of your images depend on a company's catalogue.</div>


<h3>What is actually in there: the manifest</h3>
${slide('dk-03', 6, 'Một tag trỏ tới một chỉ mục — bên dưới là nhiều ảnh')}
<pre><code>docker buildx imagetools inspect nginx:1.27-alpine | head -12</code></pre>
<div class="out">Name:      docker.io/library/nginx:1.27-alpine
MediaType: application/vnd.oci.image.index.v1+json
Digest:    sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10

Manifests:
  Name:        docker.io/library/nginx:1.27-alpine@sha256:62223d644fa234c3a1cc785ee14242ec47a77364226f1c811d2f669f96dc2ac8
  MediaType:   application/vnd.oci.image.manifest.v1+json
  Platform:    linux/amd64
  Annotations:
    org.opencontainers.image.created:         2025-04-16T17:07:33Z
    org.opencontainers.image.revision:        eaf8875a1967d24cea6ed8b37109075e39ed9e43
    org.opencontainers.image.source:          https://github.com/nginx/docker-nginx.git#eaf8875a1967d24cea6ed8b37109075e39ed9e43:mainline/alpine</div>
<p>One tag, one top-level digest, and <em>several</em> images underneath it — one per platform. This is an <strong>image index</strong> (or "manifest list"), and it is why the same <code>docker pull nginx</code> gives you an x86 image on a server and an ARM image on an M-series Mac. Lesson 3.4 covers what happens when that goes wrong, which it does in exactly one memorable way.</p>
<p class="note-ct">The output above is real (course Mac, 23/09/2026). The Engine 27 version of this lesson showed two platforms with invented, shortened digests; the real index behind <code>nginx:1.27-alpine</code> has <strong>16 entries</strong> — eight platforms and one attestation manifest per platform. List them compactly with <code>jq</code>:</p>
<pre><code class="language-bash">docker buildx imagetools inspect --raw nginx:1.27-alpine \\
  | jq -r '.manifests[] | "\\(.platform.os)/\\(.platform.architecture)\\(if .platform.variant then "/"+.platform.variant else "" end) \\(.digest[0:19]) \\(.annotations["vnd.docker.reference.type"] // "")"'</code></pre>
<div class="out">linux/amd64 sha256:62223d644fa2
unknown/unknown sha256:24abdb3793b8 attestation-manifest
linux/arm/v6 sha256:0c423916aba5
unknown/unknown sha256:4cd8ee7ae5b4 attestation-manifest
linux/arm/v7 sha256:a47e59cb8b0d
unknown/unknown sha256:e9ba9743109f attestation-manifest
linux/arm64/v8 sha256:63ffc0d1f14e
unknown/unknown sha256:efec97e07db5 attestation-manifest
linux/386 sha256:297103a3c691
unknown/unknown sha256:2079782fcbba attestation-manifest
linux/ppc64le sha256:d4b29f8fae6d
unknown/unknown sha256:441460ebaaa7 attestation-manifest
linux/riscv64 sha256:c3c39065d81b
unknown/unknown sha256:0f62d942d5e8 attestation-manifest
linux/s390x sha256:a697209b4a44
unknown/unknown sha256:02689ce8ee2c attestation-manifest</div>
<table>
<tr><th>Word</th><th>What it is</th><th>Where you see it</th></tr>
<tr><td>Image index (manifest list)</td><td>A small JSON file listing one manifest per platform. What a multi-arch tag points at.</td><td><code>MediaType: …image.index.v1+json</code></td></tr>
<tr><td>Manifest</td><td>The recipe for ONE platform: which config blob and which layer blobs, by digest.</td><td>each entry under <code>Manifests:</code></td></tr>
<tr><td>Config</td><td>JSON with <code>Os</code>, <code>Architecture</code>, <code>Env</code>, <code>Cmd</code>, labels, history.</td><td><code>docker image inspect</code></td></tr>
<tr><td>Layers (blobs)</td><td>The compressed tar files of the filesystem (Lesson 1.2).</td><td><code>docker history</code>, <code>docker push</code> lines</td></tr>
<tr><td>Attestation manifest</td><td>SBOM and build provenance attached by BuildKit; platform <code>unknown/unknown</code>, never pulled to run.</td><td><code>vnd.docker.reference.type: attestation-manifest</code></td></tr>
</table>

<pre><code>docker image inspect nginx:1.27-alpine \\
  --format 'os={{.Os}} arch={{.Architecture}} layers={{len .RootFS.Layers}} created={{.Created}}'
docker image inspect nginx:1.27-alpine --format '{{json .Config.Labels}}' | tr ',' '\\n' | head -4</code></pre>
<div class="out">os=linux arch=arm64 layers=8 created=2025-04-16T14:50:31Z
{"maintainer":"NGINX Docker Maintainers &lt;docker-maint@nginx.com&gt;"}</div>
<p class="note-ct">Real output (course Mac, arm64). The Engine 27 version of this lesson printed <code>arch=amd64</code>, a creation date in 2026 and two <code>org.opencontainers.image.*</code> labels — none of which is true for this image: it was last built on <strong>16 April 2025</strong>, and its config carries only the <code>maintainer</code> label. Where the provenance really lives is the next section.</p>
<div class="callout ok"><strong>The <code>org.opencontainers.image.*</code> labels are how you find out where an image came from.</strong> <code>image.source</code> points at the repository that built it, <code>image.revision</code> at the exact commit, <code>image.created</code> at the build time. Any image without them is asking you to take its provenance on trust. Chapter 4 shows how to add them to your own images in three lines — and Chapter 11 uses them to answer "which commit is production running?" in one command.</div>


<h3>Labels vs annotations: where the provenance of an official image really is</h3>
${slide('dk-03', 7, 'Nguồn gốc ảnh nằm ở annotation — không phải ở label')}
<p>There are two places metadata can be attached to an image, and they are easy to confuse. A <strong>label</strong> lives inside the image <em>config</em> — you write it with <code>LABEL</code> in a Dockerfile or <code>--label</code> on <code>docker build</code>, and <code>docker image inspect</code> shows it under <code>.Config.Labels</code>. An <strong>annotation</strong> is attached to a <em>manifest or index</em> in the registry — <code>docker image inspect</code> does not show it at all; <code>docker buildx imagetools inspect</code> does. Docker's official-images pipeline records the source repository, commit and version as annotations, so that is where to look:</p>
<pre><code class="language-bash">docker buildx imagetools inspect nginx:1.27-alpine | sed -n '9,17p'</code></pre>
<div class="out">  Annotations:
    org.opencontainers.image.created:         2025-04-16T17:07:33Z
    org.opencontainers.image.revision:        eaf8875a1967d24cea6ed8b37109075e39ed9e43
    org.opencontainers.image.source:          https://github.com/nginx/docker-nginx.git#eaf8875a1967d24cea6ed8b37109075e39ed9e43:mainline/alpine
    org.opencontainers.image.url:             https://hub.docker.com/_/nginx
    org.opencontainers.image.version:         1.27.5-alpine
    com.docker.official-images.bashbrew.arch: amd64
    org.opencontainers.image.base.digest:     sha256:816d6a9736a3ccb74b5b0eb915c4ffb37bf6b7a98e7aaa715001ce3235a8a019
    org.opencontainers.image.base.name:       nginx:1.27.5-alpine-slim</div>
<p>Everything you need to trace this image is there: the exact commit (<code>revision</code>) in the exact repository and folder (<code>source</code>), the real version (<code>1.27.5</code>, not the <code>1.27.2</code> the old text claimed), and even the image it was built on (<code>base.name</code> and <code>base.digest</code>). For <em>your own</em> images you can use either mechanism — Chapter 4 adds labels with three lines of Dockerfile — but when you read someone else's image, check both.</p>
<div class="callout warn"><strong>A pinned minor version is only safe while its branch is alive.</strong> <code>nginx:1.27-alpine</code> was a good choice in early 2025. But nginx 1.27 was a <em>mainline</em> branch; when 1.28 replaced it, the 1.27 tags simply stopped moving. The annotation above says it plainly: last built 16 April 2025. On 23/09/2026 <code>nginx:alpine</code> resolves to <code>1.31.6-alpine</code>, built the day before. A tag that no longer moves no longer receives security patches, and nothing warns you — so for every image in your Compose file, look at <code>org.opencontainers.image.created</code> once in a while. Anything more than a few months old deserves a question.</div>
<h3>Reading a tag before you trust it</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">nginx:1.27-alpine</span><span class="v">Minor version pinned, Alpine base. Moves only within 1.27.x patches. A good default: security fixes arrive, breaking changes do not.</span></div>
  <div class="kv"><span class="k">node:22-slim</span><span class="v">Debian-based, but with docs, man pages and extra packages removed. Bigger than Alpine and uses glibc, which avoids a whole class of native-module problems (Chapter 6).</span></div>
  <div class="kv"><span class="k">postgres:16.4</span><span class="v">Fully pinned. Predictable, and it stops receiving patches — you have to bump it yourself. Correct for a database where you want to choose your upgrade moment.</span></div>
  <div class="kv"><span class="k">python:3.12-bookworm</span><span class="v">The Debian release is named in the tag. Useful when a native dependency needs a specific system library version.</span></div>
  <div class="kv"><span class="k">redis:latest</span><span class="v">Whatever the maintainers pushed most recently, which may be a new major version. Fine for a throwaway experiment; a genuine outage waiting to happen in a Compose file (Lesson 3.2).</span></div>
  <div class="kv"><span class="k">someimage:v2-2026-08-22-a1b2c3d</span><span class="v">The shape your own CI should produce: version, date and commit in one string. Sortable, traceable, and it never means two different things.</span></div>
</div>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your SWP391 team's <code>compose.yaml</code> has grown four images from four different tutorials: <code>postgres</code>, <code>bitnami/redis:7.2</code>, <code>nginx:1.27-alpine</code> and <code>myteam/api</code>. Before the demo you want to know exactly where each one comes from, who maintains it, and whether it still gets patches.</p><ol>
<li>In <code>~/thu-docker</code>, create <code>anh.txt</code> and write the <strong>fully expanded</strong> reference of each of the four names (registry/namespace/repository:tag).</li>
<li>For each one, ask the registry without pulling: <code>docker buildx imagetools inspect &lt;name&gt; | head -3</code>. Note the index digest. Which one fails, and which row of the name-splitting table explains the error?</li>
<li>For the two official images, read the annotations of the <code>linux/amd64</code> entry and write down <code>version</code> and <code>created</code> (command below).</li>
<li>Decide for each image: keep, change the tag, or replace. Write one line of reason next to each in <code>anh.txt</code>.</li></ol>
<pre><code class="language-bash">for i in postgres nginx:1.27-alpine; do
  echo "== $i"
  docker buildx imagetools inspect "$i" | grep -m2 -E 'image.version|image.created'
done</code></pre>
<p><strong>Done when:</strong> <code>anh.txt</code> has four expanded names, an index digest for each image that still exists, and an explanation for the two that fail — <code>myteam/api</code> went to Docker Hub as an account name, and <code>bitnami/redis:7.2</code> now answers <code>not found</code> (on 23/09/2026 the course Mac got exactly <code>ERROR: docker.io/bitnami/redis:7.2: not found</code> — the 2025 Bitnami change above). You have also found that <code>nginx:1.27-alpine</code> has not been rebuilt since April 2025.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Image reference</span><span class="v">The full name of an image: <code>registry/namespace/repository:tag@digest</code>.</span></div>
  <div class="kv"><span class="k">Registry</span><span class="v">A server that stores and serves images over HTTP: Docker Hub, GHCR, your own <code>registry:2</code>.</span></div>
  <div class="kv"><span class="k">Namespace</span><span class="v">The account or organisation that owns a repository; <code>library</code> is the official-images namespace.</span></div>
  <div class="kv"><span class="k">Repository</span><span class="v">One named image family (<code>nginx</code>) holding many tags and many platforms.</span></div>
  <div class="kv"><span class="k">Tag</span><span class="v">A human label pointing at one image or index; it can be moved.</span></div>
  <div class="kv"><span class="k">Digest</span><span class="v">The SHA-256 of a manifest or index; a name for the content itself.</span></div>
  <div class="kv"><span class="k">Image index</span><span class="v">A list of per-platform manifests behind one tag; what makes a tag multi-architecture.</span></div>
  <div class="kv"><span class="k">Annotation</span><span class="v">Metadata attached to a manifest in the registry — where official images record source, commit and version.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>nginx</code> is short for <code>docker.io/library/nginx:latest</code>: registry, namespace and tag all have defaults.</li>
<li>The first part is a registry only if it has a dot, a colon, or is <code>localhost</code>; otherwise it is a Docker Hub account.</li>
<li>A multi-arch tag points at an index; each machine picks the manifest for its own platform.</li>
<li>Docker 29 shows the index digest as the IMAGE ID — the ID and the digest are one number.</li>
<li>Official images record their source commit and version as annotations; read them with <code>docker buildx imagetools inspect</code>.</li>
<li>A pinned minor tag stops receiving patches when its branch ends — check <code>image.created</code>.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/image/pull/#description" target="_blank" rel="noopener">
  <span class="lc-ico">📥</span>
  <span class="lc-body"><span class="lc-title">docker pull — image reference syntax</span><span class="lc-sub">The formal grammar of a reference, including the "does it contain a dot" rule that decides whether the first component is a registry or a namespace.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/docker-hub/repos/#official-images" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">Docker Official Images</span><span class="lc-sub">What the programme guarantees, who maintains them, and how to read the tag list on a Hub page — including the "supported tags" section that tells you which tags are aliases of each other.</span></span>
</a>
<a class="link-card" href="https://github.com/opencontainers/image-spec/blob/main/annotations.md" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">OCI standard annotations</span><span class="lc-sub">The full list of <code>org.opencontainers.image.*</code> labels. Adopt these names rather than inventing your own; tooling already understands them.</span></span>
</a>
<a class="link-card" href="https://github.com/bitnami/containers/issues/83267" target="_blank" rel="noopener">
  <span class="lc-ico">📣</span>
  <span class="lc-body"><span class="lc-title">Bitnami's 2025 catalogue change</span><span class="lc-sub">The original announcement: dates, the bitnamilegacy namespace and the brownout schedule. A real example of a namespace owner changing what a name means.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: read the name</span><span class="lc-sub">Graded exercises: expand five short references to their full form, say which of two similar names is the official image, and find the source repository of an image from its labels alone.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>docker push myregistry/app</code> failing with an authentication error against Docker Hub. Docker decides the first component is a registry only if it contains a dot or a colon, or is <code>localhost</code>. <code>myregistry/app</code> has neither, so it is read as the Hub user <code>myregistry</code> — and you get a login error for an account you do not own. Use <code>localhost:5000/app</code>, <code>registry.internal/app</code>, or an IP. The same rule catches people with <code>minikube/app</code> and <code>k3s/app</code>.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Every image name is <code>registry/namespace/repository:tag</code> with the first three defaulting to <code>docker.io/library</code> and the tag defaulting to <code>latest</code> — so <code>nginx</code> means far more than it says. One tag can point at an index containing several per-platform images, which is why the same command gives different bytes on an ARM laptop and an x86 server. And the <code>org.opencontainers.image.source</code> label is how you find out where an image really came from; an image without it is asking for trust it has not earned.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Đọc một cái tên ảnh</h2>
<p class="lead"><code>nginx</code> trông như một cái tên. Thật ra nó là BỐN trường mà ba trong số đó bị bỏ trống, và Docker điền vào chỗ trống bằng những giá trị mặc định bạn không bao giờ nhìn thấy. Biết mấy mặc định đó là khác biệt giữa "nó kéo về một cái gì đó" với việc biết CHÍNH XÁC bạn sắp chạy cái gì trên máy chủ của mình.</p>

<h3>Bốn phần</h3>
${slide('dk-03', 3, '“nginx” là 4 trường — Docker tự điền 3')}
<pre><code><span class="tok-comment"># Dạng đầy đủ, không bỏ sót gì:</span>
docker.io/library/nginx:1.27-alpine
<span class="tok-comment"># ^^^^^^^^ ^^^^^^^ ^^^^^ ^^^^^^^^^^^</span>
<span class="tok-comment"># registry không-gian-tên kho  tag</span>

docker pull nginx:1.27-alpine
docker image inspect nginx:1.27-alpine --format '{{index .RepoTags 0}}'
docker image inspect nginx:1.27-alpine --format '{{index .RepoDigests 0}}'</code></pre>
<div class="out">nginx:1.27-alpine
nginx@sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">registry — mặc định là docker.io</span><span class="lz-lnote">Máy chủ phục vụ cái ảnh. <code>ghcr.io</code>, <code>quay.io</code>, <code>registry.gitlab.com</code>, <code>123456.dkr.ecr.ap-southeast-1.amazonaws.com</code>, hay của chính bạn. Docker nhận ra nó vì nó chứa một dấu chấm hoặc một dấu hai chấm, hoặc đúng bằng <code>localhost</code> — đó là lý do <code>myregistry/app</code> không có dấu chấm bị coi là một <em>KHÔNG GIAN TÊN</em> trên Docker Hub, chứ không phải một máy chủ.</span></div>
  <div class="lz-layer"><span class="lz-lname">không gian tên — mặc định là library</span><span class="lz-lnote">Tài khoản hoặc tổ chức. <code>library</code> là không gian tên của chính Docker dành cho ảnh chính thức đã tuyển chọn, và nó là cái duy nhất bạn không bao giờ phải gõ. <code>bitnami/postgresql</code>, <code>cuonghoang1103/api</code> — đó là không gian tên của người dùng.</span></div>
  <div class="lz-layer"><span class="lz-lname">kho — phần DUY NHẤT bắt buộc</span><span class="lz-lnote">Tên của cái thứ đó: <code>nginx</code>, <code>postgres</code>, <code>node</code>. Một kho chứa nhiều tag và nhiều kiến trúc.</span></div>
  <div class="lz-layer"><span class="lz-lname">tag — mặc định là latest</span><span class="lz-lnote">Một cái nhãn cho người đọc, trỏ tới một cái ảnh. Nó là một <strong>CON TRỎ THAY ĐỔI ĐƯỢC</strong>, không phải một phiên bản — Bài 3.2 nói về việc vì sao điều đó quan trọng hơn mọi thứ khác trong chương này.</span></div>
  <div class="lz-layer"><span class="lz-lname">hoặc @digest — thay cho tag</span><span class="lz-lnote"><code>nginx@sha256:6564…</code> gọi tên chính NỘI DUNG. Bất biến theo cấu tạo: cái chuỗi đó chỉ có thể trỏ tới đúng những byte ấy.</span></div>
</div>
<pre><code><span class="tok-comment"># Cả bốn lệnh này kéo về CÙNG một cái ảnh</span>
docker pull nginx:1.27-alpine
docker pull library/nginx:1.27-alpine
docker pull docker.io/nginx:1.27-alpine
docker pull docker.io/library/nginx:1.27-alpine
docker images nginx --format '{{.Repository}}:{{.Tag}} {{.ID}}'</code></pre>
<div class="out">nginx:alpine 72ba65eb42c1
nginx:1.27-alpine 65645c7bb6a0</div>
<p class="note-ct">Output thật, chạy lại trên máy Mac của khoá (Docker Desktop 4.91 / Engine 29.8, kho ảnh containerd). Bản cũ của bài viết theo Engine 27 in ở đây một dòng bịa. Có hai điều đáng để ý. Bộ lọc <code>docker images nginx</code> khớp theo <em>kho</em> (repository), nên mọi tag nginx đang có trên máy đều hiện ra — ở đây có thêm <code>nginx:alpine</code>. Và trên Docker 29, IMAGE ID <code>65645c7bb6a0</code> chính là 12 ký tự đầu của digest chỉ mục <code>sha256:65645c7b…</code> mà <code>RepoDigests</code> vừa in phía trên: ID và digest là CÙNG một con số (Bài 3.2 giải thích vì sao).</p>



<h3>Docker tách một cái tên thế nào: luật dấu chấm, dấu hai chấm, localhost</h3>
${slide('dk-03', 4, 'Có dấu chấm, dấu hai chấm hay localhost ⇒ mới là registry')}
<p>Mọi thứ đứng trước dấu <code>/</code> đầu tiên đều mập mờ: nó có thể là tên máy chủ registry (<code>ghcr.io</code>) hoặc là một tài khoản trên Docker Hub (<code>bitnami</code>). Docker phân xử bằng MỘT luật máy móc — không tra cứu, không đoán. Thành phần đầu tiên chỉ được coi là <strong>registry (kho ảnh)</strong> nếu nó chứa dấu <code>.</code> (một tên miền), chứa dấu <code>:</code> (một cổng), hoặc đúng bằng <code>localhost</code>. Còn lại thì nó là một <strong>namespace (không gian tên — tức tài khoản/tổ chức)</strong> trên Docker Hub. Một cái tên không có dấu <code>/</code> nào thì nhận cả hai mặc định: registry <code>docker.io</code>, không gian tên <code>library</code>.</p>
<table>
<tr><th>Bạn gõ</th><th>Thành phần đầu là…</th><th>Docker thật sự xin</th></tr>
<tr><td><code>nginx</code></td><td>(không có — không có dấu /)</td><td><code>docker.io/library/nginx:latest</code></td></tr>
<tr><td><code>bitnami/redis:7.2</code></td><td><code>bitnami</code>: không chấm, không hai chấm ⇒ không gian tên</td><td><code>docker.io/bitnami/redis:7.2</code></td></tr>
<tr><td><code>myregistry/app</code></td><td><code>myregistry</code>: không có chấm ⇒ <strong>một tài khoản Hub</strong></td><td><code>docker.io/myregistry/app:latest</code> — hầu như KHÔNG BAO GIỜ là thứ bạn muốn</td></tr>
<tr><td><code>myregistry:5000/app</code></td><td>có dấu hai chấm ⇒ máy chủ registry + cổng</td><td><code>https://myregistry:5000/v2/app/…</code></td></tr>
<tr><td><code>ghcr.io/cuonghoang1103/api:1.4</code></td><td>có dấu chấm ⇒ registry</td><td>GitHub Container Registry</td></tr>
<tr><td><code>localhost:18030/app</code></td><td><code>localhost</code> + cổng ⇒ registry</td><td>registry đang chạy trên chính máy này</td></tr>
<tr><td><code>NGINX</code></td><td>—</td><td>bị từ chối: tên kho phải là chữ thường</td></tr>
</table>
<p>Bạn có thể nhìn từng trường hợp hỏng theo đúng kiểu riêng của nó (máy Mac của khoá, Docker 29.8):</p>
<pre><code class="language-bash">docker pull myregistry/app
docker pull myregistry:5000/app
docker pull NGINX</code></pre>
<div class="out">Using default tag: latest
Error response from daemon: pull access denied for myregistry/app, repository does not exist or may require 'docker login'
Error response from daemon: failed to resolve reference "myregistry:5000/app:latest": failed to do request: Head "https://myregistry:5000/v2/app/manifests/latest": dialing myregistry:5000 container via direct connection because Docker Desktop has no HTTPS proxy: connecting to myregistry:5000: dial tcp: lookup myregistry: no such host
invalid reference format: repository name (library/NGINX) must be lowercase</div>
<p>Hãy đọc ba lỗi này như chính cái luật đang chạy. Lỗi đầu đi tới <em>Docker Hub</em> và xin một tài khoản tên <code>myregistry</code> — câu "pull access denied … may require docker login" là cách Hub nói "không có kho nào như thế mà bạn được thấy". Lỗi thứ hai, vì có dấu hai chấm, đi tìm một <em>MÁY CHỦ</em> tên <code>myregistry</code> và hỏng ở bước tra DNS (<code>no such host</code>) — đúng kiểu hỏng phải có. Lỗi thứ ba còn chưa rời khỏi máy bạn: bản thân cái tên đã sai, và thông báo còn cho bạn thấy dạng đã khai triển <code>library/NGINX</code>.</p>
<div class="callout"><strong>Tag và digest theo cùng logic "dấu phân cách cuối cùng".</strong> Tag là phần đứng sau dấu hai chấm <em>CUỐI CÙNG</em> của thành phần đường dẫn cuối cùng, nên <code>localhost:18030/app</code> không có tag (dấu hai chấm đó thuộc về máy chủ) còn <code>localhost:18030/app:1.0</code> thì có. Digest luôn được mở đầu bằng <code>@</code>. Nếu có cả hai — <code>nginx:1.27-alpine@sha256:…</code> — thì digest quyết định bạn nhận được byte nào, còn tag chỉ là lời chú thích cho người đọc (Bài 3.2 chứng minh điều này).</div>
<h3>Chạy thử từng bước: khai triển một cái tên và chứng minh hai cách viết là một ảnh</h3>
<ol>
<li>Kéo bằng tên ngắn rồi bằng tên viết đầy đủ. Lần kéo thứ hai phải báo <em>up to date</em> — bằng chứng rằng hai cái tên trỏ vào cùng một thứ:
<pre><code class="language-bash">docker pull nginx:1.27-alpine
docker pull docker.io/library/nginx:1.27-alpine</code></pre>
<div class="out">Digest: sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10
Status: Image is up to date for nginx:1.27-alpine
docker.io/library/nginx:1.27-alpine</div>
Để ý dòng cuối: chính Docker in ra tham chiếu đầy đủ mà nó đã dùng.</li>
<li>Hỏi cái ảnh về tên của chính nó — tag cho người đọc và digest của nội dung:
<pre><code class="language-bash">docker image inspect nginx:1.27-alpine --format '{{index .RepoTags 0}}'
docker image inspect nginx:1.27-alpine --format '{{index .RepoDigests 0}}'</code></pre></li>
<li>Hỏi <em>registry</em> (không cần kéo) xem cái tên đó thật ra là gì — một chỉ mục của nhiều nền tảng:
<pre><code class="language-bash">docker buildx imagetools inspect nginx:1.27-alpine | head -8</code></pre></li>
<li>Cố tình làm hỏng với <code>myregistry/app</code>, <code>myregistry:5000/app</code> và <code>NGINX</code>, rồi ghép từng lỗi với một dòng của bảng ở trên.</li>
</ol>
<h3>Ảnh chính thức và mọi thứ còn lại</h3>
${slide('dk-03', 5, 'Phần trước dấu / cho biết ai chịu trách nhiệm về ảnh')}
<pre><code>docker pull nginx:1.27-alpine        <span class="tok-comment"># chính thức: không gian tên library, không có dấu /</span>
docker pull bitnami/nginx:latest     <span class="tok-comment"># ảnh của một công ty</span>
docker pull ghcr.io/jqlang/jq:latest <span class="tok-comment"># registry riêng của một dự án</span>
docker images --format 'table {{.Repository}}\\t{{.Tag}}\\t{{.Size}}' | head -5</code></pre>
<div class="out">REPOSITORY          TAG            SIZE
nginx               1.27-alpine    52.5MB
bitnami/nginx       latest         168MB
ghcr.io/jqlang/jq   latest         5.24MB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Ảnh chính thức (không có không gian tên)</span><span class="v">Được Docker soát, dựng từ Dockerfile công khai, dựng lại khi ảnh nền của chúng có bản vá an ninh, và có tài liệu trên Hub. <code>nginx</code>, <code>postgres</code>, <code>node</code>, <code>redis</code>, <code>alpine</code>. Hãy mặc định chọn những cái này.</span></div>
  <div class="kv"><span class="k">Verified Publisher / Sponsored OSS</span><span class="v">Do nhà cung cấp bảo trì, có huy hiệu trên Hub — <code>bitnami/*</code>, <code>grafana/*</code>, <code>hashicorp/*</code>. Nhìn chung đáng tin và thường tuỳ chỉnh được nhiều hơn ảnh chính thức, đổi lại nặng hơn và áp đặt hơn.</span></div>
  <div class="kv"><span class="k">Ảnh của bất kỳ ai</span><span class="v"><code>someuser/thing</code> là một tài khoản trên Docker Hub, hoàn toàn không có soát xét nào. Hãy đọc Dockerfile của nó trước khi chạy — và lưu ý rằng nhiều ảnh nổi tiếng trong các bài hướng dẫn đã ba năm chưa được dựng lại và mang theo mọi CVE công bố từ đó tới nay.</span></div>
  <div class="kv"><span class="k">Có tên máy chủ registry đứng trước</span><span class="v"><code>ghcr.io/…</code>, <code>quay.io/…</code>, <code>gcr.io/…</code>. Ngày càng thành chuẩn mực với những dự án muốn tránh giới hạn tần suất của Docker Hub — bao gồm cả ảnh từ CI của chính bạn (Bài 3.3).</span></div>
</div>
<div class="callout warn"><strong>Chiếm tên gõ nhầm là chuyện CÓ THẬT.</strong> <code>node</code> là ảnh chính thức; <code>nodejs</code> là tài khoản của một ai đó. <code>ubunut</code>, <code>pyhton</code>, <code>redsi</code> — mọi cách gõ sai hợp lý của một ảnh nổi tiếng đều đã có người đăng ký ở thời điểm nào đó, và một container chạy dưới quyền root và gắn thư mục mã nguồn của bạn vào là một chỗ tuyệt vời để đặt thứ gì đó khó chịu. Hãy tìm huy hiệu "Docker Official Image" trên Hub, ưu tiên những cái tên không có không gian tên với phần mềm nổi tiếng, và ghim một digest cho mọi thứ đụng tới production (Bài 3.2).</div>
<div class="pitfall co-tieu-de"><strong>Một vụ có thật năm 2025: chủ không gian tên đổi luật chơi.</strong> Tháng 8/2025 Bitnami thông báo rằng từ ngày 28/8, danh mục miễn phí của họ trên Docker Hub sẽ thu lại chỉ còn một nhóm nhỏ ảnh "hardened" ở tag <code>latest</code>, còn các tag có số phiên bản (<code>bitnami/postgresql:15</code>, <code>bitnami/redis:7.2</code>…) bị dời sang một không gian tên mới đóng băng là <code>bitnamilegacy/*</code>, không còn cập nhật — kèm những đợt "brownout" (tạm tắt) theo lịch, và việc xoá hẳn được hoãn tới 29/9/2025. Hàng nghìn file Compose và Helm chart không hề sửa một dòng nào bỗng kéo ảnh thất bại. Chẳng có gì trong <em>cái tên</em> cảnh báo ai cả: hôm trước <code>bitnami/…</code> trông vẫn đáng tin y như thường. Bài học cho file của chính bạn: một không gian tên thuộc về một ai đó, và thứ họ công bố dưới đó là quyết định của họ. Hãy ưu tiên ảnh chính thức cho các dịch vụ phổ biến, và biết rõ ảnh nào của mình đang phụ thuộc vào danh mục của một công ty.</div>


<h3>Bên trong thật sự có gì: cái manifest</h3>
${slide('dk-03', 6, 'Một tag trỏ tới một chỉ mục — bên dưới là nhiều ảnh')}
<pre><code>docker buildx imagetools inspect nginx:1.27-alpine | head -12</code></pre>
<div class="out">Name:      docker.io/library/nginx:1.27-alpine
MediaType: application/vnd.oci.image.index.v1+json
Digest:    sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10

Manifests:
  Name:        docker.io/library/nginx:1.27-alpine@sha256:62223d644fa234c3a1cc785ee14242ec47a77364226f1c811d2f669f96dc2ac8
  MediaType:   application/vnd.oci.image.manifest.v1+json
  Platform:    linux/amd64
  Annotations:
    org.opencontainers.image.created:         2025-04-16T17:07:33Z
    org.opencontainers.image.revision:        eaf8875a1967d24cea6ed8b37109075e39ed9e43
    org.opencontainers.image.source:          https://github.com/nginx/docker-nginx.git#eaf8875a1967d24cea6ed8b37109075e39ed9e43:mainline/alpine</div>
<p>Một tag, một digest ở tầng trên, và <em>NHIỀU</em> ảnh nằm bên dưới nó — mỗi nền tảng một cái. Đây là một <strong>CHỈ MỤC ẢNH</strong> (hay "manifest list"), và đó là lý do cùng một lệnh <code>docker pull nginx</code> cho bạn ảnh x86 trên máy chủ và ảnh ARM trên một máy Mac dòng M. Bài 3.4 nói về chuyện gì xảy ra khi việc đó trục trặc, và nó trục trặc theo đúng một kiểu rất đáng nhớ.</p>
<p class="note-ct">Output phía trên là output thật (máy Mac của khoá, 23/09/2026). Bản viết theo Engine 27 của bài này cho thấy hai nền tảng với những digest bịa, cắt ngắn; chỉ mục thật đứng sau <code>nginx:1.27-alpine</code> có <strong>16 mục</strong> — tám nền tảng và mỗi nền tảng một manifest chứng thực. Liệt kê gọn bằng <code>jq</code>:</p>
<pre><code class="language-bash">docker buildx imagetools inspect --raw nginx:1.27-alpine \\
  | jq -r '.manifests[] | "\\(.platform.os)/\\(.platform.architecture)\\(if .platform.variant then "/"+.platform.variant else "" end) \\(.digest[0:19]) \\(.annotations["vnd.docker.reference.type"] // "")"'</code></pre>
<div class="out">linux/amd64 sha256:62223d644fa2
unknown/unknown sha256:24abdb3793b8 attestation-manifest
linux/arm/v6 sha256:0c423916aba5
unknown/unknown sha256:4cd8ee7ae5b4 attestation-manifest
linux/arm/v7 sha256:a47e59cb8b0d
unknown/unknown sha256:e9ba9743109f attestation-manifest
linux/arm64/v8 sha256:63ffc0d1f14e
unknown/unknown sha256:efec97e07db5 attestation-manifest
linux/386 sha256:297103a3c691
unknown/unknown sha256:2079782fcbba attestation-manifest
linux/ppc64le sha256:d4b29f8fae6d
unknown/unknown sha256:441460ebaaa7 attestation-manifest
linux/riscv64 sha256:c3c39065d81b
unknown/unknown sha256:0f62d942d5e8 attestation-manifest
linux/s390x sha256:a697209b4a44
unknown/unknown sha256:02689ce8ee2c attestation-manifest</div>
<table>
<tr><th>Từ</th><th>Là gì</th><th>Thấy ở đâu</th></tr>
<tr><td>Image index / manifest list (chỉ mục ảnh)</td><td>Một file JSON nhỏ liệt kê mỗi nền tảng một manifest. Là thứ mà một tag đa kiến trúc trỏ vào.</td><td><code>MediaType: …image.index.v1+json</code></td></tr>
<tr><td>Manifest (bản kê)</td><td>"Công thức" cho MỘT nền tảng: blob config nào, những blob tầng nào — gọi bằng digest.</td><td>từng mục dưới <code>Manifests:</code></td></tr>
<tr><td>Config (cấu hình ảnh)</td><td>JSON chứa <code>Os</code>, <code>Architecture</code>, <code>Env</code>, <code>Cmd</code>, label, lịch sử.</td><td><code>docker image inspect</code></td></tr>
<tr><td>Layer / blob (tầng)</td><td>Các file tar nén của hệ thống file (Bài 1.2).</td><td><code>docker history</code>, các dòng của <code>docker push</code></td></tr>
<tr><td>Attestation manifest (manifest chứng thực)</td><td>SBOM và thông tin xuất xứ bản dựng do BuildKit đính kèm; nền tảng <code>unknown/unknown</code>, không bao giờ được kéo về để chạy.</td><td><code>vnd.docker.reference.type: attestation-manifest</code></td></tr>
</table>

<pre><code>docker image inspect nginx:1.27-alpine \\
  --format 'os={{.Os}} arch={{.Architecture}} tầng={{len .RootFS.Layers}} tạo lúc={{.Created}}'
docker image inspect nginx:1.27-alpine --format '{{json .Config.Labels}}' | tr ',' '\\n' | head -4</code></pre>
<div class="out">os=linux arch=arm64 tầng=8 tạo lúc=2025-04-16T14:50:31Z
{"maintainer":"NGINX Docker Maintainers &lt;docker-maint@nginx.com&gt;"}</div>
<p class="note-ct">Output thật (máy Mac của khoá, arm64). Bản viết theo Engine 27 của bài in ra <code>arch=amd64</code>, một ngày tạo năm 2026 và hai label <code>org.opencontainers.image.*</code> — không cái nào đúng với ảnh này: nó được dựng lần cuối ngày <strong>16/04/2025</strong>, và config của nó chỉ mang đúng label <code>maintainer</code>. Thông tin xuất xứ thật sự nằm ở đâu thì xem mục ngay sau.</p>
<div class="callout ok"><strong>Những nhãn <code>org.opencontainers.image.*</code> là cách bạn biết một cái ảnh từ đâu ra.</strong> <code>image.source</code> trỏ tới kho mã đã dựng nó, <code>image.revision</code> tới đúng cái commit, <code>image.created</code> tới thời điểm dựng. Bất kỳ ảnh nào KHÔNG có chúng là đang đòi bạn tin vào xuất xứ của nó mà không có bằng chứng. Chương 4 chỉ cách thêm chúng vào ảnh của chính bạn trong ba dòng — và Chương 11 dùng chúng để trả lời "production đang chạy commit nào?" bằng một câu lệnh.</div>


<h3>Label và annotation: thông tin xuất xứ của ảnh chính thức thật ra nằm ở đâu</h3>
${slide('dk-03', 7, 'Nguồn gốc ảnh nằm ở annotation — không phải ở label')}
<p>Có HAI chỗ để gắn thông tin mô tả (metadata) vào một cái ảnh, và chúng rất dễ bị lẫn. Một <strong>label (nhãn)</strong> nằm bên trong <em>config</em> của ảnh — bạn viết nó bằng <code>LABEL</code> trong Dockerfile hoặc <code>--label</code> khi <code>docker build</code>, và <code>docker image inspect</code> hiện nó ở <code>.Config.Labels</code>. Một <strong>annotation (chú thích đính kèm)</strong> được gắn lên một <em>manifest hoặc chỉ mục</em> trên registry — <code>docker image inspect</code> hoàn toàn KHÔNG hiện nó; <code>docker buildx imagetools inspect</code> thì có. Dây chuyền dựng ảnh chính thức của Docker ghi kho mã nguồn, commit và phiên bản dưới dạng annotation, nên đó mới là chỗ cần nhìn:</p>
<pre><code class="language-bash">docker buildx imagetools inspect nginx:1.27-alpine | sed -n '9,17p'</code></pre>
<div class="out">  Annotations:
    org.opencontainers.image.created:         2025-04-16T17:07:33Z
    org.opencontainers.image.revision:        eaf8875a1967d24cea6ed8b37109075e39ed9e43
    org.opencontainers.image.source:          https://github.com/nginx/docker-nginx.git#eaf8875a1967d24cea6ed8b37109075e39ed9e43:mainline/alpine
    org.opencontainers.image.url:             https://hub.docker.com/_/nginx
    org.opencontainers.image.version:         1.27.5-alpine
    com.docker.official-images.bashbrew.arch: amd64
    org.opencontainers.image.base.digest:     sha256:816d6a9736a3ccb74b5b0eb915c4ffb37bf6b7a98e7aaa715001ce3235a8a019
    org.opencontainers.image.base.name:       nginx:1.27.5-alpine-slim</div>
<p>Mọi thứ cần để truy vết ảnh này đều ở đó: đúng commit (<code>revision</code>) trong đúng kho và đúng thư mục (<code>source</code>), phiên bản thật (<code>1.27.5</code>, không phải <code>1.27.2</code> như bài cũ viết), và cả ảnh nền mà nó được dựng lên (<code>base.name</code> và <code>base.digest</code>). Với ảnh <em>của chính bạn</em> thì dùng cơ chế nào cũng được — Chương 4 thêm label bằng ba dòng Dockerfile — nhưng khi đọc ảnh của người khác, hãy kiểm cả hai chỗ.</p>
<div class="callout warn"><strong>Ghim tới bản phụ chỉ an toàn khi nhánh đó còn sống.</strong> <code>nginx:1.27-alpine</code> là lựa chọn tốt hồi đầu năm 2025. Nhưng nginx 1.27 là một nhánh <em>mainline</em>; khi 1.28 thay thế nó, các tag 1.27 cứ thế ĐỨNG YÊN. Annotation ở trên nói thẳng: dựng lần cuối 16/04/2025. Ngày 23/09/2026, <code>nginx:alpine</code> phân giải ra <code>1.31.6-alpine</code>, dựng từ hôm trước. Một cái tag không còn dịch chuyển thì cũng không còn nhận bản vá an ninh, và chẳng có gì cảnh báo bạn — nên thỉnh thoảng hãy nhìn <code>org.opencontainers.image.created</code> của mọi ảnh trong file Compose. Cái nào đã cũ quá vài tháng thì đáng để hỏi lại.</div>
<h3>Đọc một cái tag trước khi tin nó</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">nginx:1.27-alpine</span><span class="v">Ghim tới bản phụ, nền Alpine. Chỉ dịch chuyển trong phạm vi các bản vá 1.27.x. Một mặc định tốt: bản vá an ninh vẫn tới, thay đổi phá vỡ tương thích thì không.</span></div>
  <div class="kv"><span class="k">node:22-slim</span><span class="v">Nền Debian, nhưng đã gỡ tài liệu, trang man và các gói phụ. Nặng hơn Alpine và dùng glibc, và điều đó tránh được cả một lớp vấn đề với mô-đun native (Chương 6).</span></div>
  <div class="kv"><span class="k">postgres:16.4</span><span class="v">Ghim đầy đủ. Đoán trước được, và nó thôi nhận bản vá — bạn phải tự nâng lên. Đúng cho một cơ sở dữ liệu mà bạn muốn tự chọn thời điểm nâng cấp.</span></div>
  <div class="kv"><span class="k">python:3.12-bookworm</span><span class="v">Bản phát hành Debian được ghi thẳng trong tag. Hữu ích khi một thư viện native cần một phiên bản thư viện hệ thống cụ thể.</span></div>
  <div class="kv"><span class="k">redis:latest</span><span class="v">Bất cứ thứ gì người bảo trì đẩy lên gần nhất, và đó có thể là một phiên bản lớn mới. Ổn cho một thí nghiệm vứt đi; là một sự cố có thật đang chờ sẵn trong một file Compose (Bài 3.2).</span></div>
  <div class="kv"><span class="k">someimage:v2-2026-08-22-a1b2c3d</span><span class="v">Hình hài mà CI của chính bạn nên tạo ra: phiên bản, ngày và commit trong một chuỗi. Sắp xếp được, truy vết được, và nó không bao giờ mang hai nghĩa.</span></div>
</div>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> file <code>compose.yaml</code> của nhóm SWP391 đã "mọc" ra bốn ảnh từ bốn bài hướng dẫn khác nhau: <code>postgres</code>, <code>bitnami/redis:7.2</code>, <code>nginx:1.27-alpine</code> và <code>myteam/api</code>. Trước buổi demo bạn muốn biết CHÍNH XÁC mỗi cái từ đâu ra, ai bảo trì, và nó còn nhận bản vá hay không.</p><ol>
<li>Trong <code>~/thu-docker</code>, tạo <code>anh.txt</code> và viết dạng <strong>khai triển đầy đủ</strong> của cả bốn cái tên (registry/không-gian-tên/kho:tag).</li>
<li>Với từng cái, hỏi registry mà không kéo: <code>docker buildx imagetools inspect &lt;tên&gt; | head -3</code>. Ghi lại digest chỉ mục. Cái nào báo lỗi, và dòng nào trong bảng tách tên giải thích lỗi đó?</li>
<li>Với hai ảnh chính thức, đọc annotation của mục <code>linux/amd64</code> và ghi lại <code>version</code> với <code>created</code> (lệnh bên dưới).</li>
<li>Quyết định cho từng ảnh: giữ, đổi tag, hay thay ảnh khác. Viết một dòng lý do cạnh mỗi cái trong <code>anh.txt</code>.</li></ol>
<pre><code class="language-bash">for i in postgres nginx:1.27-alpine; do
  echo "== $i"
  docker buildx imagetools inspect "$i" | grep -m2 -E 'image.version|image.created'
done</code></pre>
<p><strong>Đạt khi:</strong> <code>anh.txt</code> có bốn tên đã khai triển, digest chỉ mục cho mỗi ảnh còn tồn tại, và lời giải thích cho hai cái báo lỗi — <code>myteam/api</code> đi tới Docker Hub như một tên tài khoản, còn <code>bitnami/redis:7.2</code> giờ trả về <code>not found</code> (ngày 23/09/2026 máy Mac của khoá nhận đúng dòng <code>ERROR: docker.io/bitnami/redis:7.2: not found</code> — chính là vụ Bitnami 2025 ở trên). Bạn cũng đã phát hiện ra <code>nginx:1.27-alpine</code> không được dựng lại từ tháng 4/2025.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Image reference (tham chiếu ảnh)</span><span class="v">Tên đầy đủ của một ảnh: <code>registry/không-gian-tên/kho:tag@digest</code>.</span></div>
  <div class="kv"><span class="k">Registry (kho ảnh)</span><span class="v">Máy chủ lưu và phát ảnh qua HTTP: Docker Hub, GHCR, <code>registry:2</code> của riêng bạn.</span></div>
  <div class="kv"><span class="k">Namespace (không gian tên)</span><span class="v">Tài khoản hoặc tổ chức sở hữu kho; <code>library</code> là không gian tên của ảnh chính thức.</span></div>
  <div class="kv"><span class="k">Repository (kho)</span><span class="v">Một họ ảnh có tên (<code>nginx</code>), chứa nhiều tag và nhiều nền tảng.</span></div>
  <div class="kv"><span class="k">Tag (nhãn phiên bản)</span><span class="v">Nhãn cho người đọc, trỏ vào một ảnh hoặc một chỉ mục; dời đi được.</span></div>
  <div class="kv"><span class="k">Digest (mã băm nội dung)</span><span class="v">SHA-256 của một manifest hoặc chỉ mục; tên của chính nội dung.</span></div>
  <div class="kv"><span class="k">Image index (chỉ mục ảnh)</span><span class="v">Danh sách manifest theo từng nền tảng đứng sau một tag; thứ khiến một tag thành đa kiến trúc.</span></div>
  <div class="kv"><span class="k">Annotation (chú thích đính kèm)</span><span class="v">Metadata gắn lên manifest trên registry — nơi ảnh chính thức ghi nguồn, commit và phiên bản.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>nginx</code> là viết tắt của <code>docker.io/library/nginx:latest</code>: registry, không gian tên và tag đều có mặc định.</li>
<li>Phần đầu chỉ là registry khi có dấu chấm, dấu hai chấm, hoặc là <code>localhost</code>; còn lại là một tài khoản Docker Hub.</li>
<li>Một tag đa kiến trúc trỏ vào một chỉ mục; mỗi máy tự chọn manifest của nền tảng mình.</li>
<li>Docker 29 hiện digest chỉ mục làm IMAGE ID — ID và digest là một con số.</li>
<li>Ảnh chính thức ghi commit nguồn và phiên bản dưới dạng annotation; đọc bằng <code>docker buildx imagetools inspect</code>.</li>
<li>Tag ghim bản phụ sẽ thôi nhận bản vá khi nhánh đó kết thúc — hãy xem <code>image.created</code>.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/image/pull/#description" target="_blank" rel="noopener">
  <span class="lc-ico">📥</span>
  <span class="lc-body"><span class="lc-title">docker pull — cú pháp tham chiếu ảnh</span><span class="lc-sub">Ngữ pháp hình thức của một tham chiếu, gồm cả cái luật "có chứa dấu chấm không" quyết định thành phần đầu tiên là registry hay không gian tên.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/docker-hub/repos/#official-images" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">Docker Official Images</span><span class="lc-sub">Chương trình này bảo đảm những gì, ai bảo trì chúng, và cách đọc danh sách tag trên một trang Hub — gồm cả mục "supported tags" cho biết những tag nào là bí danh của nhau.</span></span>
</a>
<a class="link-card" href="https://github.com/opencontainers/image-spec/blob/main/annotations.md" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">Nhãn chuẩn của OCI</span><span class="lc-sub">Danh sách đầy đủ các nhãn <code>org.opencontainers.image.*</code>. Hãy dùng những cái tên này thay vì tự đặt tên riêng; công cụ đã hiểu sẵn chúng.</span></span>
</a>
<a class="link-card" href="https://github.com/bitnami/containers/issues/83267" target="_blank" rel="noopener">
  <span class="lc-ico">📣</span>
  <span class="lc-body"><span class="lc-title">Bitnami đổi danh mục năm 2025</span><span class="lc-sub">Thông báo gốc: các mốc ngày, không gian tên bitnamilegacy và lịch brownout. Một ví dụ thật về chuyện chủ không gian tên đổi ý nghĩa của một cái tên.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đọc cái tên</span><span class="lc-sub">Bài chấm điểm: khai triển năm tham chiếu ngắn thành dạng đầy đủ, nói xem trong hai cái tên na ná thì cái nào là ảnh chính thức, và tìm ra kho mã nguồn của một ảnh chỉ từ nhãn của nó.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>docker push myregistry/app</code> hỏng với một lỗi xác thực đối với Docker Hub. Docker chỉ coi thành phần đầu tiên là một registry nếu nó chứa dấu chấm hoặc dấu hai chấm, hoặc là <code>localhost</code>. <code>myregistry/app</code> chẳng có cái nào, nên nó bị đọc thành người dùng Hub tên <code>myregistry</code> — và bạn nhận lỗi đăng nhập cho một tài khoản không phải của mình. Hãy dùng <code>localhost:5000/app</code>, <code>registry.internal/app</code>, hoặc một địa chỉ IP. Cùng cái luật đó bẫy những người viết <code>minikube/app</code> và <code>k3s/app</code>.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Mọi tên ảnh đều là <code>registry/không-gian-tên/kho:tag</code> với ba phần đầu mặc định thành <code>docker.io/library</code> và tag mặc định thành <code>latest</code> — nên <code>nginx</code> mang nhiều nghĩa hơn hẳn những gì nó viết ra. Một tag có thể trỏ tới một CHỈ MỤC chứa nhiều ảnh theo từng nền tảng, và đó là lý do cùng một câu lệnh cho ra những byte khác nhau trên một laptop ARM và một máy chủ x86. Và nhãn <code>org.opencontainers.image.source</code> là cách bạn biết một cái ảnh thật sự từ đâu ra; một cái ảnh không có nó là đang đòi một sự tin tưởng mà nó chưa xứng đáng.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — Tags move, digests do not|||3.2 — Tag thì di chuyển, digest thì không',
      slug: 'dk-3-2-tag-digest',
      type: 'LESSON',
      description: 'Chứng minh một tag chỉ là con trỏ, vì sao :latest gây sự cố, ghim bằng digest ở FROM và trong Compose, digest của chỉ mục khác digest của nền tảng, và một chiến lược đặt tag cho ảnh của chính bạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Tags move, digests do not</h2>
<p class="lead">A tag is a <em>label stuck on an image</em>, and labels can be peeled off and stuck on something else. That one sentence is behind a large share of "it worked yesterday" incidents, and the fix costs one line.</p>

<h3>Watch a tag move</h3>
${slide('dk-03', 8, 'Tag là nhãn dán: docker tag dời nó đi không cảnh báo')}
<pre><code>docker pull alpine:3.20
docker tag alpine:3.20 demo:v1
docker images demo --format '{{.Repository}}:{{.Tag}} {{.ID}}'

<span class="tok-comment"># now point the same tag at a completely different image</span>
docker pull busybox:1.36
docker tag busybox:1.36 demo:v1
docker images demo --format '{{.Repository}}:{{.Tag}} {{.ID}}'
docker images -f dangling=true --format '{{.ID}} {{.Repository}}:{{.Tag}}' | head -2</code></pre>
<div class="out">demo:v1 d9e853e87e55
demo:v1 73aaf090f3d8</div>
<p class="note-ct">Real output (course Mac, Docker 29.8; the demo tag was called <code>dk03-demo:v1</code> there). The Engine 27 version of this lesson showed the old image reappearing as <code>&lt;none&gt;:&lt;none&gt; a606584aa9aa</code>. That was wrong, and it is wrong on every Docker version: the old image still has <em>another</em> name, <code>alpine:3.20</code>, so it is not dangling at all. The last command lists only dangling images left over from other work (or nothing), and this one confirms the old image is untouched:</p>
<pre><code class="language-bash">docker images alpine:3.20 --format '{{.Repository}}:{{.Tag}} {{.ID}}'</code></pre>
<div class="out">alpine:3.20 d9e853e87e55</div>
<p>Same tag, different image, no warning. The old image did not disappear — and because it still has its other name it did not even become <strong>dangling</strong>. An image turns dangling (<code>&lt;none&gt;</code>) only when the tag that moves was its <em>only</em> name, which is exactly what happens on a server that pulls a moving tag (next section) — and that is where much of the reclaimable space in <code>docker system df</code> comes from. Nothing about this is a bug: a tag is a pointer, and pointers are meant to move. Upstream maintainers move them deliberately every time they ship a patch.</p>


<h3>Where &lt;none&gt; images really come from: pulling a tag that moved</h3>
${slide('dk-03', 9, 'Kéo lại một tag đã dời ⇒ ảnh cũ thành mồ côi')}
<p>The realistic way to manufacture dangling images is the deploy loop of a small project: a build machine pushes a new image under the same tag (<code>:latest</code>, or <code>:main</code>), and the server runs <code>docker pull</code>. The server's local tag follows the registry to the new image, and the previous image — which had no other name on that server — is left nameless. We reproduced it with the course's two machines: the Mac built and pushed to a local <code>registry:2</code>, the Linux box played the server.</p>
<pre><code class="language-bash"><span class="tok-comment"># on the server (Linux, Docker 29.6) — release A is running</span>
docker pull localhost:18030/dk03-web:latest
docker run --name dk03-web localhost:18030/dk03-web:latest
<span class="tok-comment"># … the Mac pushes release B to the SAME tag, then on the server:</span>
docker pull localhost:18030/dk03-web:latest
docker images -a --format '{{.Repository}}:{{.Tag}} {{.ID}} {{.CreatedSince}}' | grep -i 'dk03\\|none'
docker ps -a --filter name=dk03 --format '{{.Names}} {{.Image}} {{.Status}}'</code></pre>
<div class="out">Status: Downloaded newer image for localhost:18030/dk03-web:latest
localhost:18030/dk03-web:latest
localhost:18030/dk03-web:latest bd97053ba6fc 3 seconds ago
&lt;none&gt;:&lt;none&gt; 85cc7a3cc38a 6 seconds ago
dk03-web 85cc7a3cc38a Exited (0) 3 seconds ago</div>
<p>Three things to read in that output. The new image <code>bd97053ba6fc</code> took the name. The old one <code>85cc7a3cc38a</code> is now <code>&lt;none&gt;:&lt;none&gt;</code>. And the container that was created from release A now shows only an ID in its IMAGE column — it has lost the name too, which is why "which version is this container running?" becomes hard to answer. We then removed the container and pushed a third release: the dangling list grew to two. One more dangling image per deploy, forever, until somebody prunes (Lesson 3.5).</p>
<div class="callout"><strong>Measured on Docker 29: rebuilding does not leave &lt;none&gt; behind — pulling does.</strong> On the classic image store, <code>docker build -t app:dev .</code> twice left the first build as <code>&lt;none&gt;</code>. On both course machines (Docker 29, containerd image store) rebuilding the same tag twice left <em>nothing</em>: <code>docker images -a</code> no longer lists the previous build at all, even while a stopped container still references it. So on a developer machine dangling images mostly come from pulls and from older Docker versions; on a server that pulls on every deploy, they pile up exactly as shown above.</div>
<h3>What :latest actually means</h3>
${slide('dk-03', 10, ':latest chỉ là tên mặc định — hôm nay nó là Postgres 18')}
<div class="kv-grid">
  <div class="kv"><span class="k">It is a default, not a superlative</span><span class="v"><code>latest</code> is simply the tag name Docker assumes when you do not give one. It has no built-in relationship to time or version numbers.</span></div>
  <div class="kv"><span class="k">It may not be the newest</span><span class="v">Many projects point <code>latest</code> at the newest <em>stable</em> release, so a prerelease is newer. Others stop updating it entirely — a repository can have a <code>latest</code> from 2021 and a <code>3.20</code> from last week.</span></div>
  <div class="kv"><span class="k">It may not exist</span><span class="v">Nothing requires a repository to have one. <code>docker pull someimage</code> then fails with <code>manifest unknown</code>, which reads like the image is missing when only the tag is.</span></div>
  <div class="kv"><span class="k">It can cross a major version</span><span class="v">This is the outage. <code>postgres:latest</code> moved from 16 to 17, and in 2025 to 18; your Compose file pulled it on a fresh machine; the data directory is from an older version and the server refuses to start. Postgres 18 even moved the data directory itself (below).</span></div>
  <div class="kv"><span class="k">It breaks reproducibility silently</span><span class="v">Two developers, one Compose file, two different Node versions — and the bug only appears on one machine. Nothing in git differs, which is what makes it expensive to find.</span></div>
</div>
<pre><code><span class="tok-comment"># The failure, in three commands</span>
docker pull postgres:latest &gt;/dev/null
docker image inspect postgres:latest --format '{{range .Config.Env}}{{println .}}{{end}}' | grep PG_MAJOR
<span class="tok-comment"># six months later, on a new machine, the SAME command gives:</span>
<span class="tok-comment"># PG_MAJOR=17  → "database files are incompatible with server"</span></code></pre>
<div class="out">PG_MAJOR=16</div><div class="out">PG_MAJOR=16</div>
<p class="note-ct">Correction: the Engine 27 version of this block used <code>--format '{{index .Config.Env 1}}'</code>. Environment variables are a list, and position 1 in the postgres image is <code>GOSU_VERSION=1.19</code>, not <code>PG_MAJOR</code> — so the old command could never have printed what it claimed. Filter by name instead, as above. And the "six months later" is no longer hypothetical. You do not even need to pull to see what <code>latest</code> is today: <code>imagetools</code> reads the config straight from the registry.</p>
<pre><code class="language-bash">docker buildx imagetools inspect postgres:latest \\
  --format '{{json (index .Image "linux/arm64")}}' | jq -r '.config.Env[]' | grep -E 'PG_MAJOR|PG_VERSION|PGDATA'</code></pre>
<div class="out">PG_MAJOR=18
PG_VERSION=18.6-1.pgdg13+2
PGDATA=/var/lib/postgresql/18/docker</div>
<table>
<tr><th>Tag (read 23/09/2026)</th><th>PG_MAJOR</th><th>PGDATA</th></tr>
<tr><td><code>postgres:16-alpine</code></td><td>16 (16.15)</td><td><code>/var/lib/postgresql/data</code></td></tr>
<tr><td><code>postgres:17-alpine</code></td><td>17 (17.11)</td><td><code>/var/lib/postgresql/data</code></td></tr>
<tr><td><code>postgres:latest</code> · <code>18-alpine</code></td><td>18 (18.6)</td><td><code>/var/lib/postgresql/18/docker</code></td></tr>
</table>
<p>So a Compose file written in 2024 as <code>image: postgres:latest</code> with <code>-v pgdata:/var/lib/postgresql/data</code> now gets a server that looks for its data somewhere else entirely. We ran exactly that on the course Mac: a Postgres 16 container wrote a table into a named volume, then the same volume was mounted into <code>postgres:18-alpine</code>:</p>
<pre><code class="language-bash">docker run -d --name pg16 -e POSTGRES_PASSWORD=x -v pgdata:/var/lib/postgresql/data postgres:16-alpine
docker exec pg16 psql -U postgres -c "create table don_hang(id int); insert into don_hang values (42);"
docker rm -f pg16
docker run --name pg18 -e POSTGRES_PASSWORD=x -v pgdata:/var/lib/postgresql/data postgres:18-alpine
docker inspect pg18 --format '{{.State.Status}} {{.State.ExitCode}}'</code></pre>
<div class="out">Error: in 18+, these Docker images are configured to store database data in a
       format which is compatible with "pg_ctlcluster" (specifically, using
       major-version-specific directory names).  This better reflects how
       PostgreSQL itself works, and how upgrades are to be performed.
…
       Counter to that, there appears to be PostgreSQL data in:
         /var/lib/postgresql/data

       This is usually the result of upgrading the Docker image without
       upgrading the underlying database using "pg_upgrade" (which requires both
       versions).
…
exited 1</div>
<p>Your data is safe — the image refused rather than overwrote — but the database is down, on a machine where nobody changed a line. The fix is not to "make latest work": it is to write the major version you actually run (<code>postgres:16-alpine</code>) and upgrade on purpose, with <code>pg_upgrade</code> or a dump and restore, when you choose to.</p>


<h3>Digests: the immutable name</h3>
${slide('dk-03', 11, 'Digest = SHA-256 của chính các byte manifest')}
<pre><code>docker image inspect nginx:1.27-alpine --format '{{index .RepoDigests 0}}'
docker pull nginx@sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10
docker images nginx --format '{{.Repository}}:{{.Tag}} {{.ID}}'</code></pre>
<div class="out">nginx@sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10
nginx:alpine 72ba65eb42c1
nginx:1.27-alpine 65645c7bb6a0</div>
<p class="note-ct">Real output on Docker 29 (course Mac). The Engine 27 version showed an extra <code>nginx &lt;none&gt;</code> row for the digest pull; on the containerd image store pulling by digest an image you already have adds no row at all — the image is the same object, and its ID is its digest.</p>
<p>The digest is the SHA-256 of the image manifest, so it is a name derived from the content. It cannot be repointed: change one byte and it is a different digest. That makes it the only truly reproducible way to refer to an image, and the registry verifies it on every pull — a corrupted or tampered download fails rather than running.</p>

<h3>Try it step by step: prove that a digest is just a hash of bytes</h3>
<p>"Content-addressed" sounds abstract until you compute a digest yourself. Run a throwaway registry on a port from your range, push one image, download its index as a file, and hash the file:</p>
<pre><code class="language-bash">docker run -d --name reg -p 18030:5000 registry:2
docker build -t localhost:18030/nhom/api:1.0 .        <span class="tok-comment"># any small Dockerfile</span>
docker push localhost:18030/nhom/api:1.0 | tail -1
curl -s -H 'Accept: application/vnd.oci.image.index.v1+json' \\
  localhost:18030/v2/nhom/api/manifests/1.0 -o m.json
shasum -a 256 m.json                                  <span class="tok-comment"># Linux: sha256sum m.json</span>
docker images localhost:18030/nhom/api --format '{{.ID}}'</code></pre>
<div class="out">1.0: digest: sha256:a00cf050ee0d2feaa229e0bcce8c8f26b583e6f3252a7faac62c1f11b9f194c2 size: 855
a00cf050ee0d2feaa229e0bcce8c8f26b583e6f3252a7faac62c1f11b9f194c2  m.json
a00cf050ee0d</div>
<p>Three views, one number: the digest the push reported, the SHA-256 of the 855 bytes you downloaded (<code>size: 855</code> is that file's length), and the IMAGE ID on a Docker 29 machine. That is the whole trick behind "immutable": nobody can change what <code>sha256:a00cf0…</code> refers to, because changing a single byte of the manifest produces a different hash — and your Docker daemon recomputes the hash of everything it downloads and refuses anything that does not match. The <code>Accept</code> header matters: ask for a different media type and the registry may serve a converted document with a different hash.</p>
<table>
<tr><th>Piece</th><th>Meaning</th></tr>
<tr><td><code>-H 'Accept: …index.v1+json'</code></td><td>"give me the document exactly as it was pushed" — an OCI image index</td></tr>
<tr><td><code>/v2/&lt;repo&gt;/manifests/&lt;tag&gt;</code></td><td>the registry API path for a manifest or index (Lesson 3.3)</td></tr>
<tr><td><code>shasum -a 256</code></td><td>macOS; on Linux the same thing is <code>sha256sum</code></td></tr>
<tr><td><code>size: 855</code> in the push line</td><td>the byte length of that same manifest</td></tr>
</table>
<div class="lz-map">
  <div class="lz-stage">Use a tag when…</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">You want patches automatically</span><span class="lz-nsub">Development, local experiments, and base images in a Dockerfile you rebuild weekly in CI. <code>node:22-alpine</code> quietly picking up a security fix is a feature.</span></div></div>
  <div class="lz-stage">Use a digest when…</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"The same bytes, everywhere, forever"</span><span class="lz-nsub">Production Compose files, deployment manifests, and any base image where a surprise rebuild would be a bad day. Also required by most supply-chain policies.</span></div></div>
  <div class="lz-stage">Use both</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">tag@digest — readable and pinned</span><span class="lz-nsub"><code>nginx:1.27-alpine@sha256:6564…</code> is legal and is the best form: a human can see the version, the machine uses the digest, and a bot can bump both together.</span></div></div>
</div>
<pre><code><span class="tok-comment"># Pinning in the three places it matters</span>
<span class="tok-comment"># Dockerfile</span>
FROM node:22-alpine@sha256:b6f26b36c8ff49624cfdac716b8ea1138d606df02586a77d364bb5536a634f85

<span class="tok-comment"># compose.yaml</span>
services:
  db:
    image: postgres:16-alpine@sha256:721873c34ceb9f8d8fc265984940dc982404c105f19ad51be9fdc5970a6080ea

<span class="tok-comment"># and getting the digest to paste, for any image</span>
docker buildx imagetools inspect --format '{{.Manifest.Digest}}' postgres:16-alpine</code></pre>
<div class="out">sha256:721873c34ceb9f8d8fc265984940dc982404c105f19ad51be9fdc5970a6080ea</div>
<div class="callout warn"><strong>There are two kinds of digest and picking the wrong one loses multi-architecture support.</strong> <code>docker buildx imagetools inspect</code> gives you the <em>index</em> digest, which still resolves per-platform — that is the one you want. <code>docker image inspect … .RepoDigests</code> on a machine that already pulled gives the same index digest, but a digest copied out of the <code>Manifests:</code> section of an <code>imagetools</code> listing is a <em>platform-specific</em> manifest, and pinning that means an ARM machine will pull an x86 image and fail with <code>exec format error</code> (Lesson 3.4).</div>


<h3>Two kinds of digest, seen failing — and which one wins over a tag</h3>
${slide('dk-03', 12, 'Hai loại digest: của chỉ mục (đúng) và của một nền tảng (bẫy)')}
<p>The warning above is easy to nod at and hard to picture, so here it is for real. The Mac built <code>dk03-multi:1</code> for two platforms (Lesson 3.4) and pushed it; its <em>index</em> digest is <code>e2ff2c8a…</code>, and inside it the <code>linux/arm64</code> manifest has its own digest <code>5d668cf2…</code>. On the amd64 Linux machine:</p>
<pre><code class="language-bash">docker run --rm localhost:18030/dk03-multi:1
docker run --rm localhost:18030/dk03-multi@sha256:5d668cf2c0455d7ab88dc05757876e5b59fd95c5dd7bde06a62a05e37dd8b6ba; echo "exit=$?"</code></pre>
<div class="out">dung tren linux/arm64 cho linux/amd64
x86_64
WARNING: The requested image's platform (linux/arm64) does not match the detected host platform (linux/amd64/v3) and no specific platform was requested
exec /bin/sh: exec format error
exit=255</div>
<p>By tag (which points at the index) the Linux machine picked its own <code>linux/amd64</code> entry and ran natively. By the platform digest it was forced onto the arm64 image — a perfectly valid, verified image that this CPU cannot execute. Pin the digest printed on the <code>Digest:</code> line of <code>imagetools inspect</code>, or by <code>RepoDigests</code>; never one copied from the <code>Manifests:</code> list.</p>
<p>And when a reference has both a tag and a digest, which one decides? The digest, always. We asked for <code>nginx:latest</code> but gave the digest of <code>1.27-alpine</code>:</p>
<pre><code class="language-bash">docker pull nginx:latest@sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10</code></pre>
<div class="out">Status: Image is up to date for nginx@sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10
docker.io/library/nginx:latest@sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10</div>
<p>Docker did not even look at <code>latest</code>: it fetched exactly the 1.27 bytes (already on the machine, hence "up to date") and did not create a local <code>nginx:latest</code> tag. That is why <code>image:tag@sha256:…</code> is safe — and also why a mismatched pair is dangerous: the tag becomes a lie that humans will believe. Let a bot (Renovate, Dependabot) update the two together.</p>
<h3>Keeping pins current</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">The cost of pinning</span><span class="v">A pinned base image stops receiving security updates. That is the whole point, and it is also a liability: an unattended pin from 2024 is a pile of unpatched CVEs. Pinning is a commitment to updating deliberately.</span></div>
  <div class="kv"><span class="k">Renovate / Dependabot</span><span class="v">Both understand <code>FROM image:tag@sha256:…</code> and open a pull request when the tag moves. This is the answer: pinned by default, updated by a bot, reviewed by a human. Set it up once.</span></div>
  <div class="kv"><span class="k">Rebuild on a schedule</span><span class="v">A weekly CI job that rebuilds with <code>--pull</code> catches base-image patches even on tag-pinned builds. Cheap, and it means your image is never more than seven days behind.</span></div>
  <div class="kv"><span class="k">docker scout / trivy</span><span class="v">Scan the image you actually ship and report known CVEs by layer. Chapter 6 covers this properly; the point here is that pinning without scanning is how you freeze a vulnerability in place.</span></div>
</div>

<h3>Tagging your own images</h3>
${slide('dk-03', 13, 'Ghim tag@digest và chiến lược đặt tag')}
<pre><code><span class="tok-comment"># One build, several names — tags are cheap; the image is stored once</span>
GIT_SHA=\$(git rev-parse --short HEAD)
docker build -t app:latest \\
             -t app:1.4.2 \\
             -t app:1.4 \\
             -t "app:\$GIT_SHA" \\
             -t "app:2026-08-22-\$GIT_SHA" .
docker images app --format '{{.Tag}} {{.ID}}'</code></pre>
<div class="out">latest       7f3a2b1c9d8e
1.4.2        7f3a2b1c9d8e
1.4          7f3a2b1c9d8e
a1b2c3d      7f3a2b1c9d8e
2026-08-22-a1b2c3d 7f3a2b1c9d8e</div>
<p class="note-ct">The IDs above are illustrative. The same command run for real on the course Mac (tags prefixed <code>dk03-</code>, commit <code>cc10d2c</code>) prints one ID for all five names — Docker 29 lists tags alphabetically, and other tags of the same repository appear too:</p>
<div class="out">1.4 45bd1fe29757
1.4.2 45bd1fe29757
2026-09-23-cc10d2c 45bd1fe29757
cc10d2c 45bd1fe29757
latest 45bd1fe29757</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">One immutable tag per build</span><span class="lz-t">the commit SHA, or version-date-SHA</span><span class="lz-d">Never reused, never repointed. This is what deployments reference, so "what is production running?" always has an exact answer.</span></div>
  <div class="lz-step"><span class="lz-k">Moving aliases for humans</span><span class="lz-t">1.4 · 1 · latest · staging</span><span class="lz-d">Convenient to type and safe to move, because nothing critical points at them. They are bookmarks, not identities.</span></div>
  <div class="lz-step"><span class="lz-k">Deploy by digest or immutable tag</span><span class="lz-t">never by a moving alias</span><span class="lz-d">A rollback then means retagging or redeploying a specific digest — a ten-second operation with a guaranteed outcome.</span></div>
  <div class="lz-step"><span class="lz-k">Record where it came from</span><span class="lz-t">--label org.opencontainers.image.revision=\$GIT_SHA</span><span class="lz-d">So an image found on a server without its tags can still be traced back to a commit (Lesson 3.1).</span></div>
</div>
<pre><code>docker rmi demo:v1 &gt;/dev/null 2&gt;&amp;1; docker image prune -f &gt;/dev/null</code></pre>


<h3>When to use a tag, a digest, or both</h3>
<table>
<tr><th>Situation</th><th>Write</th><th>Why</th></tr>
<tr><td>Trying something on your laptop</td><td><code>redis:7-alpine</code></td><td>Readable; getting patches automatically is fine.</td></tr>
<tr><td>Base image in a Dockerfile rebuilt weekly in CI</td><td><code>node:22-alpine</code> (+ <code>--pull</code>)</td><td>You want the security patches; CI rebuilds catch breakage early.</td></tr>
<tr><td>The team's shared <code>compose.yaml</code></td><td><code>postgres:16-alpine</code> (major pinned)</td><td>Everyone gets the same major; never <code>latest</code> for a database.</td></tr>
<tr><td>Production deploy</td><td><code>app:1.4.2-cc10d2c</code> or <code>app@sha256:…</code></td><td>"What is running?" has one exact answer; rollback is a name.</td></tr>
<tr><td>Supply-chain-sensitive base image</td><td><code>node:22-alpine@sha256:…</code> + Renovate</td><td>Readable and immutable; the bot proposes updates as PRs.</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate cloned your project on a new laptop and the database container dies at start-up, while yours works. Your <code>compose.yaml</code> says <code>image: postgres:latest</code>. Prove what happened without touching anybody's data, then make the file reproducible.</p><ol>
<li>In <code>~/thu-docker</code>, find which Postgres <em>your</em> machine has and what <code>latest</code> means today — no pull needed for the second one:
<pre><code class="language-bash">docker image inspect postgres:latest --format '{{range .Config.Env}}{{println .}}{{end}}' | grep PG_MAJOR
docker buildx imagetools inspect postgres:latest --format '{{json (index .Image "linux/amd64")}}' | jq -r '.config.Env[]' | grep -E 'PG_MAJOR|PGDATA'</code></pre></li>
<li>Get the <em>index</em> digest of the version you actually want: <code>docker buildx imagetools inspect postgres:16-alpine | sed -n 3p</code>.</li>
<li>Rewrite the line as <code>image: postgres:16-alpine@sha256:&lt;that digest&gt;</code> and run <code>docker compose config | grep image</code> to see Compose accept it.</li>
<li>Explain in one sentence, in a comment above the line, why you pinned the major version and the digest.</li></ol>
<p><strong>Done when:</strong> you can say which major version <code>latest</code> is today and what <code>PGDATA</code> it uses, your compose line carries a 64-character <em>index</em> digest (it is on the <code>Digest:</code> line, not in the <code>Manifests:</code> list), and <code>docker compose config</code> prints it back unchanged.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mutable tag</span><span class="v">A name that can be moved to different content at any time — every tag, including <code>latest</code>.</span></div>
  <div class="kv"><span class="k">Dangling image</span><span class="v">An image with no name left (<code>&lt;none&gt;:&lt;none&gt;</code>), usually left behind when a pull moved its only tag.</span></div>
  <div class="kv"><span class="k">Digest pinning</span><span class="v">Referring to an image by <code>@sha256:…</code> so the bytes can never change under you.</span></div>
  <div class="kv"><span class="k">Index digest</span><span class="v">The digest of the multi-platform list — safe to pin on every architecture.</span></div>
  <div class="kv"><span class="k">Platform digest</span><span class="v">The digest of one platform's manifest — pinning it forces that architecture everywhere.</span></div>
  <div class="kv"><span class="k">Immutable tag</span><span class="v">A tag your CI never reuses, such as a version plus commit hash.</span></div>
  <div class="kv"><span class="k">Renovate / Dependabot</span><span class="v">Bots that open pull requests when a pinned tag or digest has a newer version.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A tag is a movable label: <code>docker tag</code> and every upstream release move tags without warning.</li>
<li>An image becomes <code>&lt;none&gt;</code> only when it loses its last name — typically on a server that pulls a moving tag.</li>
<li><code>latest</code> is just the default name; for Postgres it jumped to 18 and moved <code>PGDATA</code>.</li>
<li>A digest is the SHA-256 of the manifest bytes; you can recompute it yourself, and on Docker 29 it is the IMAGE ID.</li>
<li>Pin the index digest, never a platform digest; with <code>tag@digest</code> the digest wins.</li>
<li>Deploy by immutable tag or digest, keep moving aliases for humans, and let a bot keep pins fresh.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/docker-hub/usage/pulls/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">Docker Hub — image pull behaviour</span><span class="lc-sub">How tags resolve, when Docker re-checks the registry, and why <code>docker pull</code> on an existing tag can silently change what you have locally.</span></span>
</a>
<a class="link-card" href="https://docs.renovatebot.com/docker/" target="_blank" rel="noopener">
  <span class="lc-ico">🤖</span>
  <span class="lc-body"><span class="lc-title">Renovate — Docker digest pinning</span><span class="lc-sub">Configuration for pinning digests automatically and keeping them updated with pull requests. The practical answer to "pinning means falling behind".</span></span>
</a>
<a class="link-card" href="https://github.com/opencontainers/distribution-spec/blob/main/spec.md" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">OCI Distribution Specification</span><span class="lc-sub">How tags and digests are resolved over HTTP. Short, and it makes concrete why a digest is verifiable end to end while a tag is just a name in someone else's database.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: pin it down</span><span class="lc-sub">Graded exercises: move a tag and find the dangling image it left, pin a base image by index digest, spot the platform-specific digest that would break ARM, and design a tag set for a CI build.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> assuming a locally cached tag is current. <code>docker run app:latest</code> uses whatever <code>app:latest</code> means <em>on this machine</em>, which may be six weeks old — Docker does not re-check the registry for a tag it already has. So a deploy script that pulls no images can happily start yesterday's build, and the symptom is a fix that "did not deploy" with no error anywhere. In CI and deploy scripts, be explicit: <code>docker pull image:tag</code> first, or <code>docker run --pull=always</code>, or <code>docker build --pull</code> for base images. And prefer digests, where the question cannot arise.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A tag is a mutable pointer that upstream maintainers move on purpose — <code>latest</code> is just the default tag name, not a promise about time or version. A digest names the content and cannot be repointed, so <code>image:tag@sha256:…</code> is the form that is both readable and reproducible. And pinning is a commitment: pair it with Renovate or a scheduled rebuild, or you have frozen your security patches along with your versions.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Tag thì di chuyển, digest thì không</h2>
<p class="lead">Một cái tag là <em>một cái nhãn dán lên một cái ảnh</em>, và nhãn thì bóc ra dán sang chỗ khác được. Riêng câu đó nằm sau một phần lớn những sự cố kiểu "hôm qua nó chạy được mà", và cách chữa tốn đúng một dòng.</p>

<h3>Nhìn một cái tag di chuyển</h3>
${slide('dk-03', 8, 'Tag là nhãn dán: docker tag dời nó đi không cảnh báo')}
<pre><code>docker pull alpine:3.20
docker tag alpine:3.20 demo:v1
docker images demo --format '{{.Repository}}:{{.Tag}} {{.ID}}'

<span class="tok-comment"># giờ trỏ đúng cái tag đó sang một cái ảnh hoàn toàn khác</span>
docker pull busybox:1.36
docker tag busybox:1.36 demo:v1
docker images demo --format '{{.Repository}}:{{.Tag}} {{.ID}}'
docker images -f dangling=true --format '{{.ID}} {{.Repository}}:{{.Tag}}' | head -2</code></pre>
<div class="out">demo:v1 d9e853e87e55
demo:v1 73aaf090f3d8</div>
<p class="note-ct">Output thật (máy Mac của khoá, Docker 29.8; ở đó tag thử tên là <code>dk03-demo:v1</code>). Bản viết theo Engine 27 của bài cho thấy ảnh cũ hiện ra thành <code>&lt;none&gt;:&lt;none&gt; a606584aa9aa</code>. Điều đó SAI, và sai trên mọi phiên bản Docker: ảnh cũ vẫn còn một cái tên <em>KHÁC</em> là <code>alpine:3.20</code>, nên nó hoàn toàn không mồ côi. Lệnh cuối chỉ liệt kê những ảnh mồ côi còn sót từ việc khác (hoặc không gì cả), còn lệnh này xác nhận ảnh cũ vẫn nguyên vẹn:</p>
<pre><code class="language-bash">docker images alpine:3.20 --format '{{.Repository}}:{{.Tag}} {{.ID}}'</code></pre>
<div class="out">alpine:3.20 d9e853e87e55</div>
<p>Cùng một tag, ảnh khác nhau, không một lời cảnh báo. Cái ảnh cũ không biến mất — và vì nó vẫn còn cái tên kia nên nó còn chẳng trở thành <strong>MỒ CÔI</strong> (dangling). Một ảnh chỉ thành mồ côi (<code>&lt;none&gt;</code>) khi cái tag bị dời là cái TÊN DUY NHẤT của nó, và đó đúng là chuyện xảy ra trên một máy chủ kéo một tag đang dịch chuyển (mục ngay sau) — cũng là chỗ phần lớn dung lượng thu hồi được trong <code>docker system df</code> đến từ. Chẳng có gì trong chuyện này là một con bọ: một tag là một con trỏ, và con trỏ sinh ra để di chuyển. Người bảo trì ở thượng nguồn cố ý dịch chúng mỗi lần họ phát hành một bản vá.</p>


<h3>Ảnh &lt;none&gt; thật ra từ đâu ra: kéo một cái tag đã bị dời</h3>
${slide('dk-03', 9, 'Kéo lại một tag đã dời ⇒ ảnh cũ thành mồ côi')}
<p>Cách "sản xuất" ảnh mồ côi thực tế nhất chính là vòng deploy của một dự án nhỏ: máy dựng đẩy một ảnh mới lên dưới CÙNG một tag (<code>:latest</code>, hay <code>:main</code>), rồi máy chủ chạy <code>docker pull</code>. Tag cục bộ của máy chủ đi theo registry sang ảnh mới, còn ảnh trước đó — thứ không có tên nào khác trên máy chủ ấy — bị bỏ lại không tên. Khoá đã dựng lại đúng cảnh này bằng hai máy: máy Mac dựng và đẩy lên một <code>registry:2</code> cục bộ, máy Linux đóng vai máy chủ.</p>
<pre><code class="language-bash"><span class="tok-comment"># trên máy chủ (Linux, Docker 29.6) — bản A đang chạy</span>
docker pull localhost:18030/dk03-web:latest
docker run --name dk03-web localhost:18030/dk03-web:latest
<span class="tok-comment"># … máy Mac đẩy bản B lên CÙNG tag đó, rồi trên máy chủ:</span>
docker pull localhost:18030/dk03-web:latest
docker images -a --format '{{.Repository}}:{{.Tag}} {{.ID}} {{.CreatedSince}}' | grep -i 'dk03\\|none'
docker ps -a --filter name=dk03 --format '{{.Names}} {{.Image}} {{.Status}}'</code></pre>
<div class="out">Status: Downloaded newer image for localhost:18030/dk03-web:latest
localhost:18030/dk03-web:latest
localhost:18030/dk03-web:latest bd97053ba6fc 3 seconds ago
&lt;none&gt;:&lt;none&gt; 85cc7a3cc38a 6 seconds ago
dk03-web 85cc7a3cc38a Exited (0) 3 seconds ago</div>
<p>Có ba điều cần đọc trong output đó. Ảnh mới <code>bd97053ba6fc</code> đã lấy cái tên. Ảnh cũ <code>85cc7a3cc38a</code> giờ là <code>&lt;none&gt;:&lt;none&gt;</code>. Và container được tạo từ bản A giờ chỉ còn hiện ID ở cột IMAGE — nó cũng mất luôn cái tên, và đó là lý do câu hỏi "container này đang chạy bản nào?" trở nên khó trả lời. Sau đó khoá xoá container và đẩy bản thứ ba: danh sách mồ côi tăng lên hai. Mỗi lần deploy thêm một ảnh mồ côi, mãi mãi, cho tới khi có người dọn (Bài 3.5).</p>
<div class="callout"><strong>Đo trên Docker 29: dựng lại KHÔNG để lại &lt;none&gt; — kéo thì CÓ.</strong> Trên kho ảnh cổ điển, <code>docker build -t app:dev .</code> hai lần để lại bản dựng đầu thành <code>&lt;none&gt;</code>. Trên cả hai máy của khoá (Docker 29, kho ảnh containerd), dựng lại cùng một tag hai lần KHÔNG để lại gì: <code>docker images -a</code> không còn liệt kê bản dựng trước nữa, kể cả khi một container đã dừng vẫn tham chiếu tới nó. Nên trên máy lập trình, ảnh mồ côi chủ yếu đến từ việc kéo và từ các bản Docker cũ; trên một máy chủ kéo ảnh mỗi lần deploy thì chúng chất đống đúng như ở trên.</div>
<h3>:latest thật ra nghĩa là gì</h3>
${slide('dk-03', 10, ':latest chỉ là tên mặc định — hôm nay nó là Postgres 18')}
<div class="kv-grid">
  <div class="kv"><span class="k">Nó là một MẶC ĐỊNH, không phải một tính từ so sánh nhất</span><span class="v"><code>latest</code> đơn giản là cái tên tag mà Docker giả định khi bạn không đưa cái nào. Nó không có quan hệ dựng sẵn nào với thời gian hay số phiên bản.</span></div>
  <div class="kv"><span class="k">Nó có thể KHÔNG phải cái mới nhất</span><span class="v">Nhiều dự án trỏ <code>latest</code> vào bản phát hành ỔN ĐỊNH mới nhất, nên một bản tiền phát hành thì mới hơn. Số khác thì ngừng cập nhật nó hẳn — một kho có thể có <code>latest</code> từ 2021 và <code>3.20</code> từ tuần trước.</span></div>
  <div class="kv"><span class="k">Nó có thể KHÔNG tồn tại</span><span class="v">Không có gì bắt một kho phải có nó. <code>docker pull someimage</code> khi đó hỏng với <code>manifest unknown</code>, nghe như cái ảnh biến mất trong khi chỉ có cái tag là không có.</span></div>
  <div class="kv"><span class="k">Nó có thể nhảy qua một phiên bản LỚN</span><span class="v">Đây chính là cú sự cố. <code>postgres:latest</code> nhảy từ 16 sang 17, rồi năm 2025 sang 18; file Compose của bạn kéo nó về trên một cái máy mới; thư mục dữ liệu là của bản cũ và máy chủ từ chối khởi động. Postgres 18 còn dời luôn cả chỗ đặt thư mục dữ liệu (ở dưới).</span></div>
  <div class="kv"><span class="k">Nó phá khả năng tái lập trong im lặng</span><span class="v">Hai lập trình viên, một file Compose, hai phiên bản Node khác nhau — và con bọ chỉ hiện ra trên một cái máy. Không có gì trong git khác nhau, và đó là thứ khiến nó đắt để tìm ra.</span></div>
</div>
<pre><code><span class="tok-comment"># Cú hỏng, trong ba câu lệnh</span>
docker pull postgres:latest &gt;/dev/null
docker image inspect postgres:latest --format '{{range .Config.Env}}{{println .}}{{end}}' | grep PG_MAJOR
<span class="tok-comment"># sáu tháng sau, trên một máy mới, CÙNG câu lệnh đó cho ra:</span>
<span class="tok-comment"># PG_MAJOR=17  → "database files are incompatible with server"</span></code></pre>
<div class="out">PG_MAJOR=16</div><div class="out">PG_MAJOR=16</div>
<p class="note-ct">Đính chính: bản viết theo Engine 27 của khối này dùng <code>--format '{{index .Config.Env 1}}'</code>. Biến môi trường là một DANH SÁCH, và vị trí số 1 trong ảnh postgres là <code>GOSU_VERSION=1.19</code>, không phải <code>PG_MAJOR</code> — nên lệnh cũ không bao giờ in ra được thứ nó khẳng định. Hãy lọc theo tên, như ở trên. Và câu "sáu tháng sau" giờ không còn là giả định nữa. Bạn thậm chí không cần kéo ảnh để xem hôm nay <code>latest</code> là gì: <code>imagetools</code> đọc config thẳng từ registry.</p>
<pre><code class="language-bash">docker buildx imagetools inspect postgres:latest \\
  --format '{{json (index .Image "linux/arm64")}}' | jq -r '.config.Env[]' | grep -E 'PG_MAJOR|PG_VERSION|PGDATA'</code></pre>
<div class="out">PG_MAJOR=18
PG_VERSION=18.6-1.pgdg13+2
PGDATA=/var/lib/postgresql/18/docker</div>
<table>
<tr><th>Tag (đọc ngày 23/09/2026)</th><th>PG_MAJOR</th><th>PGDATA</th></tr>
<tr><td><code>postgres:16-alpine</code></td><td>16 (16.15)</td><td><code>/var/lib/postgresql/data</code></td></tr>
<tr><td><code>postgres:17-alpine</code></td><td>17 (17.11)</td><td><code>/var/lib/postgresql/data</code></td></tr>
<tr><td><code>postgres:latest</code> · <code>18-alpine</code></td><td>18 (18.6)</td><td><code>/var/lib/postgresql/18/docker</code></td></tr>
</table>
<p>Vậy là một file Compose viết năm 2024 kiểu <code>image: postgres:latest</code> với <code>-v pgdata:/var/lib/postgresql/data</code> giờ nhận về một máy chủ đi tìm dữ liệu của nó ở một chỗ khác hẳn. Khoá đã chạy đúng cảnh đó trên máy Mac: một container Postgres 16 ghi một bảng vào volume có tên, rồi gắn chính volume đó vào <code>postgres:18-alpine</code>:</p>
<pre><code class="language-bash">docker run -d --name pg16 -e POSTGRES_PASSWORD=x -v pgdata:/var/lib/postgresql/data postgres:16-alpine
docker exec pg16 psql -U postgres -c "create table don_hang(id int); insert into don_hang values (42);"
docker rm -f pg16
docker run --name pg18 -e POSTGRES_PASSWORD=x -v pgdata:/var/lib/postgresql/data postgres:18-alpine
docker inspect pg18 --format '{{.State.Status}} {{.State.ExitCode}}'</code></pre>
<div class="out">Error: in 18+, these Docker images are configured to store database data in a
       format which is compatible with "pg_ctlcluster" (specifically, using
       major-version-specific directory names).  This better reflects how
       PostgreSQL itself works, and how upgrades are to be performed.
…
       Counter to that, there appears to be PostgreSQL data in:
         /var/lib/postgresql/data

       This is usually the result of upgrading the Docker image without
       upgrading the underlying database using "pg_upgrade" (which requires both
       versions).
…
exited 1</div>
<p>Dữ liệu của bạn an toàn — ảnh đã TỪ CHỐI chứ không ghi đè — nhưng cơ sở dữ liệu thì chết, trên một cái máy mà không ai sửa dòng nào. Cách chữa không phải là "làm cho latest chạy được": mà là ghi rõ bản lớn bạn thật sự đang chạy (<code>postgres:16-alpine</code>) và nâng cấp CÓ CHỦ Ý, bằng <code>pg_upgrade</code> hoặc dump rồi restore, vào lúc bạn chọn.</p>


<h3>Digest: cái tên bất biến</h3>
${slide('dk-03', 11, 'Digest = SHA-256 của chính các byte manifest')}
<pre><code>docker image inspect nginx:1.27-alpine --format '{{index .RepoDigests 0}}'
docker pull nginx@sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10
docker images nginx --format '{{.Repository}}:{{.Tag}} {{.ID}}'</code></pre>
<div class="out">nginx@sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10
nginx:alpine 72ba65eb42c1
nginx:1.27-alpine 65645c7bb6a0</div>
<p class="note-ct">Output thật trên Docker 29 (máy Mac của khoá). Bản viết theo Engine 27 có thêm một dòng <code>nginx &lt;none&gt;</code> cho lượt kéo bằng digest; trên kho ảnh containerd, kéo bằng digest một ảnh bạn đã có thì không thêm dòng nào cả — đó là cùng một đối tượng, và ID của nó chính là digest của nó.</p>
<p>Digest là mã SHA-256 của cái manifest của ảnh, nên nó là một cái tên SUY RA TỪ NỘI DUNG. Không trỏ lại được: đổi một byte là ra một digest khác. Điều đó khiến nó thành cách DUY NHẤT thật sự tái lập được để chỉ tới một cái ảnh, và registry kiểm nó ở mọi lần kéo — một bản tải hỏng hoặc bị can thiệp sẽ BÁO LỖI chứ không chạy.</p>

<h3>Chạy thử từng bước: chứng minh digest chỉ là mã băm của các byte</h3>
<p>"Định danh theo nội dung" nghe trừu tượng cho tới khi bạn tự tính một digest. Chạy một registry vứt đi ở một cổng trong dải của bạn, đẩy lên một ảnh, tải chỉ mục của nó về thành file, rồi băm cái file đó:</p>
<pre><code class="language-bash">docker run -d --name reg -p 18030:5000 registry:2
docker build -t localhost:18030/nhom/api:1.0 .        <span class="tok-comment"># Dockerfile nhỏ bất kỳ</span>
docker push localhost:18030/nhom/api:1.0 | tail -1
curl -s -H 'Accept: application/vnd.oci.image.index.v1+json' \\
  localhost:18030/v2/nhom/api/manifests/1.0 -o m.json
shasum -a 256 m.json                                  <span class="tok-comment"># Linux: sha256sum m.json</span>
docker images localhost:18030/nhom/api --format '{{.ID}}'</code></pre>
<div class="out">1.0: digest: sha256:a00cf050ee0d2feaa229e0bcce8c8f26b583e6f3252a7faac62c1f11b9f194c2 size: 855
a00cf050ee0d2feaa229e0bcce8c8f26b583e6f3252a7faac62c1f11b9f194c2  m.json
a00cf050ee0d</div>
<p>Ba góc nhìn, một con số: digest mà lệnh push báo, SHA-256 của 855 byte vừa tải về (<code>size: 855</code> chính là độ dài file đó), và IMAGE ID trên một máy Docker 29. Toàn bộ bí mật của chữ "bất biến" nằm ở đây: không ai đổi được thứ mà <code>sha256:a00cf0…</code> trỏ tới, vì đổi một byte của manifest là ra mã băm khác — và tiến trình Docker của bạn tự tính lại mã băm của mọi thứ nó tải về, không khớp là từ chối. Tiêu đề <code>Accept</code> quan trọng: xin một kiểu dữ liệu khác thì registry có thể trả về một văn bản đã chuyển đổi, với mã băm khác.</p>
<table>
<tr><th>Thành phần</th><th>Nghĩa</th></tr>
<tr><td><code>-H 'Accept: …index.v1+json'</code></td><td>"đưa tôi văn bản y như lúc được đẩy lên" — một chỉ mục ảnh OCI</td></tr>
<tr><td><code>/v2/&lt;kho&gt;/manifests/&lt;tag&gt;</code></td><td>đường dẫn API của registry cho một manifest/chỉ mục (Bài 3.3)</td></tr>
<tr><td><code>shasum -a 256</code></td><td>trên macOS; trên Linux cùng việc đó là <code>sha256sum</code></td></tr>
<tr><td><code>size: 855</code> trong dòng push</td><td>độ dài tính bằng byte của chính manifest đó</td></tr>
</table>
<div class="lz-map">
  <div class="lz-stage">Dùng tag khi…</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bạn muốn nhận bản vá tự động</span><span class="lz-nsub">Lúc phát triển, thí nghiệm cục bộ, và ảnh nền trong một Dockerfile mà bạn dựng lại hằng tuần trong CI. Việc <code>node:22-alpine</code> lặng lẽ nhận một bản vá an ninh là một TÍNH NĂNG.</span></div></div>
  <div class="lz-stage">Dùng digest khi…</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"Đúng những byte đó, ở mọi nơi, mãi mãi"</span><span class="lz-nsub">File Compose cho production, manifest triển khai, và mọi ảnh nền mà một lần dựng lại bất ngờ sẽ là một ngày tồi tệ. Phần lớn chính sách về chuỗi cung ứng cũng bắt buộc nó.</span></div></div>
  <div class="lz-stage">Dùng cả hai</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">tag@digest — vừa đọc được vừa được ghim</span><span class="lz-nsub"><code>nginx:1.27-alpine@sha256:6564…</code> là hợp lệ và là dạng TỐT NHẤT: người đọc thấy phiên bản, máy dùng digest, và một con bot nâng được cả hai cùng lúc.</span></div></div>
</div>
<pre><code><span class="tok-comment"># Ghim ở ba chỗ có ý nghĩa</span>
<span class="tok-comment"># Dockerfile</span>
FROM node:22-alpine@sha256:b6f26b36c8ff49624cfdac716b8ea1138d606df02586a77d364bb5536a634f85

<span class="tok-comment"># compose.yaml</span>
services:
  db:
    image: postgres:16-alpine@sha256:721873c34ceb9f8d8fc265984940dc982404c105f19ad51be9fdc5970a6080ea

<span class="tok-comment"># và lấy cái digest để dán, cho ảnh bất kỳ</span>
docker buildx imagetools inspect --format '{{.Manifest.Digest}}' postgres:16-alpine</code></pre>
<div class="out">sha256:721873c34ceb9f8d8fc265984940dc982404c105f19ad51be9fdc5970a6080ea</div>
<div class="callout warn"><strong>Có HAI loại digest và chọn nhầm loại là mất luôn hỗ trợ đa kiến trúc.</strong> <code>docker buildx imagetools inspect</code> cho bạn digest của <em>CHỈ MỤC</em>, cái này vẫn phân giải theo từng nền tảng — đó là cái bạn muốn. <code>docker image inspect … .RepoDigests</code> trên một máy đã kéo ảnh về cũng cho cùng digest chỉ mục ấy, nhưng một digest chép ra từ phần <code>Manifests:</code> trong danh sách của <code>imagetools</code> là một manifest <em>RIÊNG CHO MỘT NỀN TẢNG</em>, và ghim cái đó nghĩa là một máy ARM sẽ kéo về một ảnh x86 rồi hỏng với <code>exec format error</code> (Bài 3.4).</div>


<h3>Hai loại digest, nhìn tận mắt cái hỏng — và cái nào thắng khi đi cùng tag</h3>
${slide('dk-03', 12, 'Hai loại digest: của chỉ mục (đúng) và của một nền tảng (bẫy)')}
<p>Lời cảnh báo ở trên rất dễ gật gù mà khó hình dung, nên đây là bản thật. Máy Mac dựng <code>dk03-multi:1</code> cho hai nền tảng (Bài 3.4) rồi đẩy lên; digest <em>chỉ mục</em> của nó là <code>e2ff2c8a…</code>, và bên trong, manifest <code>linux/arm64</code> có digest riêng là <code>5d668cf2…</code>. Trên máy Linux amd64:</p>
<pre><code class="language-bash">docker run --rm localhost:18030/dk03-multi:1
docker run --rm localhost:18030/dk03-multi@sha256:5d668cf2c0455d7ab88dc05757876e5b59fd95c5dd7bde06a62a05e37dd8b6ba; echo "exit=$?"</code></pre>
<div class="out">dung tren linux/arm64 cho linux/amd64
x86_64
WARNING: The requested image's platform (linux/arm64) does not match the detected host platform (linux/amd64/v3) and no specific platform was requested
exec /bin/sh: exec format error
exit=255</div>
<p>Theo tag (trỏ vào chỉ mục), máy Linux tự chọn mục <code>linux/amd64</code> của nó và chạy native. Theo digest nền tảng, nó bị ép vào ảnh arm64 — một ảnh hoàn toàn hợp lệ, đã được kiểm băm, mà CPU này không thực thi nổi. Hãy ghim digest in ở dòng <code>Digest:</code> của <code>imagetools inspect</code>, hoặc của <code>RepoDigests</code>; đừng bao giờ chép một digest từ danh sách <code>Manifests:</code>.</p>
<p>Còn khi một tham chiếu có cả tag lẫn digest thì cái nào quyết định? Luôn luôn là digest. Khoá xin <code>nginx:latest</code> nhưng đưa digest của <code>1.27-alpine</code>:</p>
<pre><code class="language-bash">docker pull nginx:latest@sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10</code></pre>
<div class="out">Status: Image is up to date for nginx@sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10
docker.io/library/nginx:latest@sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10</div>
<p>Docker còn chẳng thèm nhìn <code>latest</code>: nó lấy đúng những byte của 1.27 (đã có sẵn trên máy, nên báo "up to date") và không tạo tag <code>nginx:latest</code> nào cục bộ. Đó là lý do <code>image:tag@sha256:…</code> an toàn — và cũng là lý do một cặp lệch nhau lại nguy hiểm: cái tag thành một lời nói dối mà người đọc sẽ tin. Hãy để một con bot (Renovate, Dependabot) cập nhật cả hai cùng lúc.</p>
<h3>Giữ cho những cái ghim không lỗi thời</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cái giá của việc ghim</span><span class="v">Một ảnh nền bị ghim thì THÔI nhận cập nhật an ninh. Đó chính là điểm mấu chốt, và nó cũng là một khoản nợ: một cái ghim từ 2024 bị bỏ quên là một đống CVE chưa vá. Ghim là một CAM KẾT sẽ cập nhật một cách có chủ ý.</span></div>
  <div class="kv"><span class="k">Renovate / Dependabot</span><span class="v">Cả hai đều hiểu <code>FROM image:tag@sha256:…</code> và mở một pull request khi cái tag dịch đi. Đây là câu trả lời: mặc định thì ghim, để bot cập nhật, để người review. Dựng một lần là xong.</span></div>
  <div class="kv"><span class="k">Dựng lại theo lịch</span><span class="v">Một công việc CI hằng tuần dựng lại với <code>--pull</code> sẽ bắt được bản vá của ảnh nền ngay cả với những bản dựng ghim theo tag. Rẻ, và nó nghĩa là ảnh của bạn không bao giờ tụt quá bảy ngày.</span></div>
  <div class="kv"><span class="k">docker scout / trivy</span><span class="v">Quét đúng cái ảnh bạn đem đi và báo cáo các CVE đã biết theo từng tầng. Chương 6 nói tử tế về chuyện này; điểm mấu chốt ở đây là ghim mà không quét là cách bạn ĐÔNG CỨNG một lỗ hổng tại chỗ.</span></div>
</div>

<h3>Đặt tag cho ảnh của chính bạn</h3>
${slide('dk-03', 13, 'Ghim tag@digest và chiến lược đặt tag')}
<pre><code><span class="tok-comment"># Một lượt dựng, nhiều cái tên — tag thì rẻ; ảnh chỉ được lưu một lần</span>
GIT_SHA=\$(git rev-parse --short HEAD)
docker build -t app:latest \\
             -t app:1.4.2 \\
             -t app:1.4 \\
             -t "app:\$GIT_SHA" \\
             -t "app:2026-08-22-\$GIT_SHA" .
docker images app --format '{{.Tag}} {{.ID}}'</code></pre>
<div class="out">latest       7f3a2b1c9d8e
1.4.2        7f3a2b1c9d8e
1.4          7f3a2b1c9d8e
a1b2c3d      7f3a2b1c9d8e
2026-08-22-a1b2c3d 7f3a2b1c9d8e</div>
<p class="note-ct">Các ID ở trên chỉ để minh hoạ. Cùng câu lệnh đó chạy thật trên máy Mac của khoá (tag có tiền tố <code>dk03-</code>, commit <code>cc10d2c</code>) in ra MỘT ID cho cả năm cái tên — Docker 29 xếp tag theo thứ tự chữ cái, và các tag khác của cùng kho cũng hiện ra:</p>
<div class="out">1.4 45bd1fe29757
1.4.2 45bd1fe29757
2026-09-23-cc10d2c 45bd1fe29757
cc10d2c 45bd1fe29757
latest 45bd1fe29757</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Một tag BẤT BIẾN cho mỗi lượt dựng</span><span class="lz-t">mã commit, hoặc phiên bản-ngày-commit</span><span class="lz-d">Không bao giờ dùng lại, không bao giờ trỏ lại. Đây là thứ mà việc triển khai tham chiếu tới, nên "production đang chạy cái gì?" luôn có một câu trả lời chính xác.</span></div>
  <div class="lz-step"><span class="lz-k">Bí danh di chuyển được, cho người đọc</span><span class="lz-t">1.4 · 1 · latest · staging</span><span class="lz-d">Tiện gõ và an toàn khi dịch, vì không có gì quan trọng trỏ vào chúng. Chúng là dấu trang, không phải danh tính.</span></div>
  <div class="lz-step"><span class="lz-k">Triển khai bằng digest hoặc tag bất biến</span><span class="lz-t">đừng bao giờ bằng một bí danh di chuyển được</span><span class="lz-d">Khi đó quay lui chỉ là gắn lại tag hoặc triển khai lại một digest cụ thể — một thao tác mười giây với kết quả chắc chắn.</span></div>
  <div class="lz-step"><span class="lz-k">Ghi lại nó từ đâu ra</span><span class="lz-t">--label org.opencontainers.image.revision=\$GIT_SHA</span><span class="lz-d">Để một cái ảnh tìm thấy trên máy chủ mà không còn tag nào vẫn truy được về một commit (Bài 3.1).</span></div>
</div>
<pre><code>docker rmi demo:v1 &gt;/dev/null 2&gt;&amp;1; docker image prune -f &gt;/dev/null</code></pre>


<h3>Khi nào dùng tag, khi nào dùng digest, khi nào dùng cả hai</h3>
<table>
<tr><th>Tình huống</th><th>Viết</th><th>Vì sao</th></tr>
<tr><td>Thử cái gì đó trên laptop</td><td><code>redis:7-alpine</code></td><td>Dễ đọc; tự nhận bản vá là ổn.</td></tr>
<tr><td>Ảnh nền trong Dockerfile được CI dựng lại hằng tuần</td><td><code>node:22-alpine</code> (+ <code>--pull</code>)</td><td>Bạn MUỐN bản vá an ninh; CI dựng lại sẽ bắt lỗi sớm.</td></tr>
<tr><td><code>compose.yaml</code> dùng chung của nhóm</td><td><code>postgres:16-alpine</code> (ghim bản lớn)</td><td>Cả nhóm cùng một bản lớn; không bao giờ <code>latest</code> cho CSDL.</td></tr>
<tr><td>Deploy production</td><td><code>app:1.4.2-cc10d2c</code> hoặc <code>app@sha256:…</code></td><td>"Đang chạy gì?" có đúng một câu trả lời; quay lui là gọi một cái tên.</td></tr>
<tr><td>Ảnh nền nhạy cảm về chuỗi cung ứng</td><td><code>node:22-alpine@sha256:…</code> + Renovate</td><td>Vừa đọc được vừa bất biến; bot đề xuất cập nhật bằng PR.</td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn cùng nhóm clone dự án về laptop mới và container CSDL chết ngay lúc khởi động, trong khi máy bạn vẫn chạy. <code>compose.yaml</code> của bạn ghi <code>image: postgres:latest</code>. Hãy chứng minh chuyện gì đã xảy ra mà không đụng vào dữ liệu của ai, rồi làm cho file tái lập được.</p><ol>
<li>Trong <code>~/thu-docker</code>, tìm xem máy <em>của bạn</em> đang có Postgres bản nào và hôm nay <code>latest</code> nghĩa là gì — cái sau không cần kéo:
<pre><code class="language-bash">docker image inspect postgres:latest --format '{{range .Config.Env}}{{println .}}{{end}}' | grep PG_MAJOR
docker buildx imagetools inspect postgres:latest --format '{{json (index .Image "linux/amd64")}}' | jq -r '.config.Env[]' | grep -E 'PG_MAJOR|PGDATA'</code></pre></li>
<li>Lấy digest <em>chỉ mục</em> của bản bạn thật sự muốn: <code>docker buildx imagetools inspect postgres:16-alpine | sed -n 3p</code>.</li>
<li>Viết lại dòng đó thành <code>image: postgres:16-alpine@sha256:&lt;digest đó&gt;</code> và chạy <code>docker compose config | grep image</code> để thấy Compose chấp nhận nó.</li>
<li>Giải thích bằng một câu, trong dòng chú thích phía trên, vì sao bạn ghim bản lớn và ghim digest.</li></ol>
<p><strong>Đạt khi:</strong> bạn nói được hôm nay <code>latest</code> là bản lớn nào và dùng <code>PGDATA</code> gì, dòng compose của bạn mang một digest <em>chỉ mục</em> 64 ký tự (nằm ở dòng <code>Digest:</code>, không phải trong danh sách <code>Manifests:</code>), và <code>docker compose config</code> in nó ra y nguyên.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mutable tag (tag dời được)</span><span class="v">Một cái tên có thể bị dời sang nội dung khác bất cứ lúc nào — mọi tag, kể cả <code>latest</code>.</span></div>
  <div class="kv"><span class="k">Dangling image (ảnh mồ côi)</span><span class="v">Ảnh không còn tên nào (<code>&lt;none&gt;:&lt;none&gt;</code>), thường bị bỏ lại khi một lượt kéo dời mất tag duy nhất của nó.</span></div>
  <div class="kv"><span class="k">Digest pinning (ghim bằng digest)</span><span class="v">Gọi ảnh bằng <code>@sha256:…</code> để các byte không bao giờ đổi sau lưng bạn.</span></div>
  <div class="kv"><span class="k">Index digest (digest chỉ mục)</span><span class="v">Digest của danh sách đa nền tảng — ghim được an toàn trên mọi kiến trúc.</span></div>
  <div class="kv"><span class="k">Platform digest (digest nền tảng)</span><span class="v">Digest của manifest một nền tảng — ghim nó là ép kiến trúc đó lên mọi máy.</span></div>
  <div class="kv"><span class="k">Immutable tag (tag bất biến)</span><span class="v">Tag mà CI của bạn không bao giờ dùng lại, ví dụ phiên bản kèm mã commit.</span></div>
  <div class="kv"><span class="k">Renovate / Dependabot (bot cập nhật)</span><span class="v">Bot mở pull request khi tag hoặc digest đã ghim có bản mới hơn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tag là một nhãn dời được: <code>docker tag</code> và mọi lần phát hành ở thượng nguồn đều dời tag mà không báo.</li>
<li>Một ảnh chỉ thành <code>&lt;none&gt;</code> khi mất cái tên cuối cùng — điển hình là trên máy chủ kéo một tag đang dịch chuyển.</li>
<li><code>latest</code> chỉ là tên mặc định; với Postgres nó đã nhảy lên 18 và dời cả <code>PGDATA</code>.</li>
<li>Digest là SHA-256 của các byte manifest; bạn tự tính lại được, và trên Docker 29 nó chính là IMAGE ID.</li>
<li>Ghim digest chỉ mục, đừng ghim digest nền tảng; với <code>tag@digest</code> thì digest thắng.</li>
<li>Deploy bằng tag bất biến hoặc digest, giữ bí danh dời được cho người đọc, và để bot giữ cho ghim luôn mới.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/docker-hub/usage/pulls/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">Docker Hub — hành vi kéo ảnh</span><span class="lc-sub">Tag được phân giải thế nào, khi nào Docker kiểm lại registry, và vì sao <code>docker pull</code> lên một tag đã có thể âm thầm đổi thứ bạn đang giữ trên máy.</span></span>
</a>
<a class="link-card" href="https://docs.renovatebot.com/docker/" target="_blank" rel="noopener">
  <span class="lc-ico">🤖</span>
  <span class="lc-body"><span class="lc-title">Renovate — ghim digest cho Docker</span><span class="lc-sub">Cấu hình để tự động ghim digest và giữ chúng cập nhật bằng pull request. Câu trả lời thực tế cho "ghim nghĩa là tụt hậu".</span></span>
</a>
<a class="link-card" href="https://github.com/opencontainers/distribution-spec/blob/main/spec.md" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Đặc tả phân phối OCI</span><span class="lc-sub">Tag và digest được phân giải qua HTTP ra sao. Ngắn, và nó cụ thể hoá vì sao một digest kiểm chứng được từ đầu tới cuối còn một cái tag chỉ là một cái tên trong cơ sở dữ liệu của người khác.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: ghim nó lại</span><span class="lc-sub">Bài chấm điểm: dịch một cái tag rồi tìm ra cái ảnh mồ côi nó để lại, ghim một ảnh nền bằng digest chỉ mục, phát hiện cái digest riêng-nền-tảng sẽ làm hỏng ARM, và thiết kế một bộ tag cho một lượt dựng CI.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> cho rằng một cái tag đã lưu trên máy là mới nhất. <code>docker run app:latest</code> dùng bất cứ thứ gì <code>app:latest</code> đang mang nghĩa <em>TRÊN CÁI MÁY NÀY</em>, và thứ đó có thể đã sáu tuần tuổi — Docker KHÔNG kiểm lại registry với một cái tag nó đã có. Nên một script deploy không kéo ảnh nào có thể vui vẻ khởi chạy bản dựng của hôm qua, và triệu chứng là một bản vá "không deploy được" mà chẳng có lỗi nào ở đâu. Trong CI và script deploy, hãy tường minh: <code>docker pull image:tag</code> trước, hoặc <code>docker run --pull=always</code>, hoặc <code>docker build --pull</code> cho ảnh nền. Và hãy ưu tiên digest, chỗ mà câu hỏi này không thể phát sinh.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Một cái tag là một con trỏ thay đổi được mà người bảo trì ở thượng nguồn CỐ Ý dịch — <code>latest</code> chỉ là cái tên tag mặc định, không phải một lời hứa về thời gian hay phiên bản. Một digest gọi tên NỘI DUNG và không trỏ lại được, nên <code>image:tag@sha256:…</code> là dạng vừa đọc được vừa tái lập được. Và ghim là một CAM KẾT: hãy ghép nó với Renovate hoặc một lịch dựng lại, không thì bạn vừa đông cứng luôn cả các bản vá an ninh cùng với phiên bản.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — Registries: Hub, GHCR and your own|||3.3 — Registry: Hub, GHCR và của riêng bạn',
      slug: 'dk-3-3-registry',
      type: 'LESSON',
      description: 'Registry là gì, đăng nhập và chỗ Docker cất thông tin đăng nhập (không mã hoá), đẩy ảnh lên Hub và GHCR, giới hạn tần suất kéo, dựng một registry riêng, và một gương soi để kéo nhanh hơn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Registries: Hub, GHCR and your own</h2>
<p class="lead">A registry is a web server that speaks one small standard HTTP API for storing and serving image layers. That is the whole idea — which is why Docker Hub, GitHub's registry, AWS ECR and a container you run yourself are interchangeable as far as <code>docker pull</code> is concerned.</p>

<h3>Logging in, and where the password goes</h3>
${slide('dk-03', 16, 'config.json: mật khẩu chỉ được base64 — không phải mã hoá')}
<pre><code>echo "\$DOCKER_TOKEN" | docker login -u cuonghoang1103 --password-stdin
cat ~/.docker/config.json</code></pre>
<div class="out">Login Succeeded
{
  "auths": {
    "https://index.docker.io/v1/": {
      "auth": "Y3Vvbmdob2FuZzExMDM6ZGNrcl9wYXRfeFhZWjEyMw=="
    }
  }
}</div>
<div class="callout warn"><strong>That <code>auth</code> field is base64, not encryption.</strong> <code>echo '…' | base64 -d</code> prints <code>username:token</code> in plain text. Anyone who reads <code>~/.docker/config.json</code> — a backup, a shared machine, a container you mounted your home directory into — has your registry credentials. Two things follow: use an access token rather than your account password (revocable, scoped), and on a workstation install a credential helper so the secret lives in the OS keychain instead:
<pre><code><span class="tok-comment"># Linux: pass/gpg-backed  ·  macOS: Keychain  ·  Windows: Credential Manager</span>
sudo apt install -y golang-docker-credential-helpers   <span class="tok-comment"># Ubuntu/Debian package name</span>
printf '{"credsStore":"pass"}\\n' &gt; ~/.docker/config.json
docker login          <span class="tok-comment"># the token now goes to the keychain, not the file</span></code></pre></div>
<p class="note-ct">Correction: on Ubuntu the package is called <code>golang-docker-credential-helpers</code> (checked on packages.ubuntu.com for 24.04); <code>docker-credential-helpers</code> does not exist there. The <code>pass</code> helper also needs a GPG key and <code>pass init &lt;key-id&gt;</code> once before the first login. On Docker Desktop you do not need any of this — the Mac already stores credentials in the Keychain.</p>
<h3>Try it step by step: see your password in plain text (safely)</h3>
<p>The warning is abstract until you decode a real file. Do it against a throwaway registry with a throwaway password, in a <em>separate</em> config directory so your real login is never touched. <code>htpasswd</code> ships with macOS (on Linux: package <code>apache2-utils</code> / <code>httpd-tools</code>):</p>
<pre><code class="language-bash">mkdir -p ~/thu-docker/auth &amp;&amp; cd ~/thu-docker
htpasswd -Bbn cuong matkhau123 &gt; auth/htpasswd
docker run -d --name reg-auth -p 18031:5000 -v "$PWD/auth:/auth" \\
  -e REGISTRY_AUTH=htpasswd -e REGISTRY_AUTH_HTPASSWD_REALM=thu \\
  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd registry:2
export DOCKER_CONFIG=/tmp/thu-cfg; mkdir -p $DOCKER_CONFIG     <span class="tok-comment"># a scratch config, not ~/.docker</span>
echo matkhau123 | docker login localhost:18031 -u cuong --password-stdin
cat $DOCKER_CONFIG/config.json
echo Y3Vvbmc6bWF0a2hhdTEyMw== | base64 -d; echo</code></pre>
<p>On the course's Linux machine (no credential helper installed) the output was:</p>
<div class="out">Login Succeeded

WARNING! Your credentials are stored unencrypted in '/tmp/dk03/cfg/config.json'.
Configure a credential helper to remove this warning. See
https://docs.docker.com/go/credential-store/

{
	"auths": {
		"localhost:18031": {
			"auth": "Y3Vvbmc6bWF0a2hhdTEyMw=="
		}
	}
}
cuong:matkhau123</div>
<p>Docker even warns you, and the file mode is <code>-rw-------</code> (only you can read it) — but any backup, any container you mount your home into, and any script running as you can. On the Mac the same login printed no warning and the file only said <code>"credsStore": "osxkeychain"</code> with an empty entry: the secret went to the Keychain. Your real <code>~/.docker/config.json</code> on Docker Desktop says <code>"credsStore": "desktop"</code> for the same reason. Finish with <code>docker logout localhost:18031</code>, <code>unset DOCKER_CONFIG</code> and <code>docker rm -f reg-auth</code>.</p>
<table>
<tr><th>Piece</th><th>Meaning</th></tr>
<tr><td><code>htpasswd -Bbn user pass</code></td><td><code>-B</code> bcrypt hash (the only kind <code>registry:2</code> accepts) · <code>-b</code> password on the command line · <code>-n</code> print instead of writing a file</td></tr>
<tr><td><code>REGISTRY_AUTH=htpasswd</code></td><td>turn on basic authentication in <code>registry:2</code></td></tr>
<tr><td><code>DOCKER_CONFIG=…</code></td><td>tell the CLI to use a different folder than <code>~/.docker</code> — perfect for experiments and for CI jobs</td></tr>
<tr><td><code>--password-stdin</code></td><td>read the secret from the pipe, so it is never in your shell history or <code>ps</code></td></tr>
</table>

<div class="kv-grid">
  <div class="kv"><span class="k">--password-stdin, always</span><span class="v"><code>docker login -p "\$TOKEN"</code> puts the token in your shell history, in <code>ps</code> output for every user on the machine, and in CI logs. Piping it in avoids all three, and it is the same number of keystrokes.</span></div>
  <div class="kv"><span class="k">Access tokens, not passwords</span><span class="v">Create them per machine and per purpose. They can be revoked individually, scoped to read-only, and they keep working when you enable 2FA — which a password will not.</span></div>
  <div class="kv"><span class="k">docker logout on shared machines</span><span class="v">Especially CI runners you do not exclusively own. The credential file survives the job otherwise.</span></div>
  <div class="kv"><span class="k">CI has better options</span><span class="v">GitHub Actions gives every workflow a scoped <code>GITHUB_TOKEN</code> that can push to GHCR with no secret to manage; ECR and GCR use short-lived cloud credentials. Prefer those over a long-lived personal token in a secrets store.</span></div>
</div>

<h3>Pushing an image</h3>
${slide('dk-03', 14, 'Registry chỉ là một API HTTP — đẩy là vài lệnh PUT')}
<pre><code><span class="tok-comment"># The repository name must match where it is going — tag, then push</span>
docker pull alpine:3.20
docker tag alpine:3.20 cuonghoang1103/demo:1.0
docker push cuonghoang1103/demo:1.0

<span class="tok-comment"># Same image, a different registry: just a different name</span>
docker tag alpine:3.20 ghcr.io/cuonghoang1103/demo:1.0
echo "\$GH_TOKEN" | docker login ghcr.io -u cuonghoang1103 --password-stdin
docker push ghcr.io/cuonghoang1103/demo:1.0</code></pre>
<div class="out">The push refers to repository [docker.io/cuonghoang1103/demo]
63ca1fbb43ae: Mounted from library/alpine
1.0: digest: sha256:a606584aa9aa1f0b4c3d2e1f0a9b8c7d6e5f4a39281706f5e4d3c2b1a09f8e7d6 size: 527</div>
<p><code>Mounted from library/alpine</code> is the registry telling you it already has that layer and did not need the upload. Push a 200MB image based on a common base and only your own layers actually travel — which is Lesson 1.2's content-addressed storage paying off across the network.</p>
<p class="note-ct">The push output above (to Docker Hub) is illustrative — this course does not push to real accounts, and its digest line was not from a real run. Below is the same mechanism, recorded for real against a local <code>registry:2</code>.</p>
<h3>What docker push actually sends — watched on your own registry</h3>
${slide('dk-03', 15, 'Tầng registry đã có ⇒ Mounted from, không tải lên lại')}
<p>A push is not one upload. For every layer the client first asks "do you already have <code>sha256:…</code>?" (<code>HEAD /v2/&lt;repo&gt;/blobs/&lt;digest&gt;</code>). Only the missing layers are uploaded (<code>POST</code> then <code>PUT /v2/&lt;repo&gt;/blobs/uploads/…</code>). If the registry holds that layer under a <em>different</em> repository, the client asks it to <strong>mount</strong> the blob across instead of sending it. Last comes <code>PUT /v2/&lt;repo&gt;/manifests/&lt;tag&gt;</code>: only now does the tag exist. On the course Mac, with a registry on port 18030 that already held <code>goc/alpine</code> and <code>dk03-web</code>:</p>
<pre><code class="language-bash">docker build -t localhost:18030/nhom/dk03-api:1.0 .     <span class="tok-comment"># FROM alpine:3.20 + one COPY</span>
docker push localhost:18030/nhom/dk03-api:1.0</code></pre>
<div class="out">The push refers to repository [localhost:18030/nhom/dk03-api]
af79558cf9ed: Pushed
3f26bc2dec0b: Mounted from goc/alpine
8ff4d425b3ee: Pushed
44136fa355b3: Mounted from dk03-web
1.0: digest: sha256:a00cf050ee0d2feaa229e0bcce8c8f26b583e6f3252a7faac62c1f11b9f194c2 size: 855</div>
<table>
<tr><th>Line</th><th>What happened on the wire</th></tr>
<tr><td><code>Pushed</code></td><td>the registry did not have this blob anywhere — it was uploaded</td></tr>
<tr><td><code>Mounted from goc/alpine</code></td><td>the blob already existed in another repository; zero bytes sent, just a link</td></tr>
<tr><td><code>Layer already exists</code></td><td>(not shown here) the blob already existed in <em>this</em> repository</td></tr>
<tr><td><code>1.0: digest: … size: 855</code></td><td>the manifest/index was PUT under tag <code>1.0</code>; 855 = its length in bytes</td></tr>
</table>
<p>The live terminal also shows lines like <code>3f26bc2dec0b: Waiting</code> and <code>Unavailable</code> repeated many times while the pushes run in parallel — progress noise, not errors; <code>docker push -q</code> prints only the final name. One more real line worth knowing, from pushing <code>alpine:3.20</code> itself:</p>
<div class="out"> Info -&gt; Not all multiplatform-content is present and only the available single-platform image was pushed
         sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc -&gt; sha256:45e09956dc667c5eff3583c9d94830261fb1ca0be10a0a7db36266edf5de9e1d</div>
<p>On Docker 29 your local <code>alpine:3.20</code> is the whole multi-platform index, but only the arm64 layers were ever downloaded to the Mac. Docker cannot push layers it does not have, so it pushed a <em>single-platform</em> image with a new digest and told you so. If you retag an official image and push it to your own registry expecting it to stay multi-arch, this is the line that says it did not — use <code>docker buildx imagetools create</code> to copy an index registry-to-registry instead.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Docker Hub</span><span class="v"><code>user/image</code>. Free public repositories, one free private repository, and pull rate limits that matter (below). The default, and increasingly not the best choice for CI.</span></div>
  <div class="kv"><span class="k">GHCR — ghcr.io</span><span class="v"><code>ghcr.io/owner/image</code>. Free for public images, generous for private ones, no meaningful pull limits, and it links to the repository that built it. If your code is on GitHub, this is the path of least resistance.</span></div>
  <div class="kv"><span class="k">Cloud registries</span><span class="v">ECR, Artifact Registry, ACR. Same API; authentication is a cloud credential rather than a password. Right when your deployment target is that cloud.</span></div>
  <div class="kv"><span class="k">Self-hosted</span><span class="v">The <code>registry:2</code> image, Harbor, or Gitea's built-in registry. Full control, no rate limits, and you own the backups and the TLS certificate.</span></div>
</div>

<h3>Pull rate limits</h3>
${slide('dk-03', 17, 'Docker Hub đếm lượt kéo — ẩn danh thì đếm theo IP')}
<pre><code>curl -s "https://auth.docker.io/token?service=registry.docker.io&amp;scope=repository:library/alpine:pull" \\
  | jq -r .token \\
  | { read T; curl -sI -H "Authorization: Bearer \$T" \\
      https://registry-1.docker.io/v2/library/alpine/manifests/latest \\
      | grep -i ratelimit; }</code></pre>
<div class="out">ratelimit-limit: 100;w=21600
ratelimit-remaining: 76;w=21600</div>
<p>Anonymous pulls from Docker Hub are counted <strong>per source IP address</strong> over a rolling window. On a home connection that is generous; on a shared office NAT, a cloud NAT gateway or a CI runner pool it is a shared budget, and the failure mode is <code>toomanyrequests: You have reached your pull rate limit</code> in the middle of a deploy. Docker changes these numbers periodically — the command above reports the limits that apply to you right now, which beats any documentation.</p>
<p>The numbers, as the official page states them (checked on docs.docker.com, <strong>as of 09/2026</strong>):</p>
<table>
<tr><th>Who is pulling</th><th>Pull limit</th></tr>
<tr><td>Not logged in</td><td>100 per 6 hours, per IPv4 address or per IPv6 /64 subnet</td></tr>
<tr><td>Personal (free account, logged in)</td><td>200 per 6 hours</td></tr>
<tr><td>Pro, Team, Business</td><td>unlimited (fair-use policy applies)</td></tr>
</table>
<p>How a "pull" is counted matters as much as the number: a pull of a multi-arch image counts <strong>once per architecture</strong> you download, version checks do not count, and a <code>HEAD</code> request on a manifest does not count (a <code>GET</code> does) — which is why the check command uses <code>curl -I</code>. Now the part that shows why the lesson says "trust the header": the same check, run for real from the course Mac on 23/09/2026, anonymously, over a home connection, with the official test repository:</p>
<pre><code class="language-bash">T=$(curl -s "https://auth.docker.io/token?service=registry.docker.io&amp;scope=repository:ratelimitpreview/test:pull" | jq -r .token)
curl -s --head -H "Authorization: Bearer $T" \\
  https://registry-1.docker.io/v2/ratelimitpreview/test/manifests/latest | grep -i '^ratelimit'</code></pre>
<div class="out">ratelimit-limit: 100;w=3600
ratelimit-remaining: 32;w=3600</div>
<p><code>w=3600</code> is a window of <em>one hour</em>, not the six hours (<code>w=21600</code>) the documentation and the older output above describe. The documentation and the server disagree; the header is what the server enforces on you at that moment. And <code>32</code> remaining out of 100 on a home connection shows how fast a budget shared by one IP disappears — several machines and build jobs on the same network had been pulling that afternoon. (The response also carries a <code>docker-ratelimit-source</code> header with your public IP; we cut it from the output.)</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Authenticate, even for public images</span><span class="lz-t">docker login in CI</span><span class="lz-d">An authenticated pull counts against your account rather than the shared IP, which immediately removes the "someone else on this NAT used the quota" failure.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Move your own images off Hub</span><span class="lz-t">ghcr.io, or your cloud's registry</span><span class="lz-d">Your images are the ones you pull most often. Base images from Hub are a much smaller share of the budget.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Run a pull-through cache</span><span class="lz-t">a registry:2 in mirror mode</span><span class="lz-d">One machine pulls from Hub; every other machine pulls from it. Cuts the count to near zero and makes pulls dramatically faster on a slow link — the single biggest win for a team in Vietnam pulling from a US-hosted registry.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Stop pulling what you already have</span><span class="lz-t">avoid --pull=always where it is not needed</span><span class="lz-d">A digest-pinned image never needs re-pulling. Chapter 11's deploy script pulls exactly once per release.</span></div>
</div>

<h3>Your own registry, in one command</h3>
${slide('dk-03', 18, 'Gương kéo xuyên: cả nhóm kéo từ một máy trong mạng')}
<pre><code>docker run -d --name registry -p 5000:5000 -v regdata:/var/lib/registry registry:2
docker tag alpine:3.20 localhost:5000/alpine:3.20
docker push localhost:5000/alpine:3.20
curl -s localhost:5000/v2/_catalog; echo
curl -s localhost:5000/v2/alpine/tags/list; echo</code></pre>
<div class="out">{"repositories":["alpine"]}
{"name":"alpine","tags":["3.20"]}</div>
<p>That is a complete, standards-compliant registry: it speaks the same API as Docker Hub, and <code>docker pull localhost:5000/alpine:3.20</code> works from anywhere that can reach it. It has no authentication and no TLS, so it is for a laptop or a private network — Harbor or a reverse proxy with basic auth is the next step up.</p>
<pre><code><span class="tok-comment"># A pull-through cache — /etc/docker/daemon.json on every machine</span>
{
  "registry-mirrors": ["http://registry-cache.internal:5000"],
  "live-restore": true
}
<span class="tok-comment"># and the cache itself:</span>
docker run -d --name cache -p 5000:5000 -v cachedata:/var/lib/registry \\
  -e REGISTRY_PROXY_REMOTEURL=https://registry-1.docker.io registry:2</code></pre>
<div class="callout"><strong>A mirror is transparent.</strong> With <code>registry-mirrors</code> set, <code>docker pull nginx</code> still says <code>nginx</code> everywhere — no Dockerfile, Compose file or script changes. The daemon tries the mirror first and falls back to Hub if it is unreachable. Note it only applies to Docker Hub images: a mirror does not intercept <code>ghcr.io/...</code> pulls, which need their own mirror entry or none at all.</div>


<h3>Try it step by step: a pull-through mirror on your laptop, measured</h3>
<p>You can feel what a mirror buys without touching <code>daemon.json</code>: run one and pull <em>through</em> it by name. The path must include <code>library/</code> for official images, because you are now talking to your registry directly and the Docker Hub defaults no longer apply:</p>
<pre><code class="language-bash">docker run -d --name mirror -p 18032:5000 \\
  -e REGISTRY_PROXY_REMOTEURL=https://registry-1.docker.io registry:2
time docker pull -q localhost:18032/library/busybox:1.36     <span class="tok-comment"># 1st: the mirror fetches from Hub</span>
docker rmi localhost:18032/library/busybox:1.36
time docker pull -q localhost:18032/library/busybox:1.36     <span class="tok-comment"># 2nd: served from the mirror's disk</span></code></pre>
<div class="out">localhost:18032/library/busybox:1.36
docker pull -q localhost:18032/library/busybox:1.36  0.02s user 0.02s system 0% cpu 8.925 total
localhost:18032/library/busybox:1.36
docker pull -q localhost:18032/library/busybox:1.36  0.02s user 0.02s system 1% cpu 2.794 total</div>
<p>8.9 s → 2.8 s for a 2 MB image on the course Mac; for a 1 GB <code>node</code> or <code>sonarqube</code> image on a slow link the difference is minutes, and only the first pull counts against Docker Hub's limit. Two real surprises on the way: the very first attempt failed with <code>dial tcp [::1]:18032: i/o timeout</code> because the container had not finished starting — wait a second after <code>docker run -d</code>; and <code>curl localhost:18032/v2/_catalog</code> kept answering <code>{"repositories":[]}</code> even after the cache was filled, so do not use the catalog to judge whether a mirror works — time the pulls.</p>
<table>
<tr><th>Setting</th><th>What it does</th></tr>
<tr><td><code>REGISTRY_PROXY_REMOTEURL</code></td><td>turns <code>registry:2</code> into a read-only cache of that upstream</td></tr>
<tr><td><code>REGISTRY_PROXY_USERNAME</code> / <code>_PASSWORD</code></td><td>let the mirror pull as your account — its pulls then count against your (higher) limit</td></tr>
<tr><td><code>"registry-mirrors"</code> in <code>daemon.json</code></td><td>makes every <code>docker pull nginx</code> on that machine try the mirror first — no name changes</td></tr>
<tr><td><code>-v cachedata:/var/lib/registry</code></td><td>keeps the cache across container restarts; without it every restart starts cold</td></tr>
</table>
<h3>Talking to an insecure registry</h3>
<pre><code><span class="tok-comment"># /etc/docker/daemon.json — for a plain-HTTP registry on a private network</span>
{ "insecure-registries": ["registry.internal:5000"] }</code></pre>
<pre><code>sudo systemctl restart docker
docker info --format '{{json .RegistryConfig.IndexConfigs}}' | tr ',' '\\n' | head -3</code></pre>
<div class="out">{"docker.io":{"Name":"docker.io"
"Mirrors":[]
"Secure":true</div>
<p>Docker refuses plain HTTP by default, which is correct — an unauthenticated HTTP registry can be swapped for a malicious one by anyone on the path. <code>insecure-registries</code> is an explicit, per-host opt-out for a network you control. Note that <code>localhost</code> is exempt automatically, which is why the example above worked without any configuration.</p>
<p>You can see the built-in exemption on your own machine without changing anything — this is the course Mac:</p>
<pre><code class="language-bash">docker info --format '{{json .RegistryConfig.InsecureRegistryCIDRs}}'</code></pre>
<div class="out">["::1/128","127.0.0.0/8"]</div>
<p>That is why every <code>localhost:18030/…</code> push in this chapter worked over plain HTTP. A registry on another machine in your network — say a teammate's laptop at <code>192.168.1.20:5000</code> — is not in that list, and the error is <code>http: server gave HTTP response to HTTPS client</code> until you add it to <code>insecure-registries</code> (Docker Desktop: Settings → Docker Engine) or put TLS in front of it.</p>

<pre><code>docker rm -f registry &gt;/dev/null; docker volume rm regdata &gt;/dev/null
docker rmi localhost:5000/alpine:3.20 cuonghoang1103/demo:1.0 &gt;/dev/null 2&gt;&amp;1</code></pre>


<h3>Which registry, when</h3>
<table>
<tr><th>You need…</th><th>Use</th><th>Watch out for</th></tr>
<tr><td>Public base images</td><td>Docker Hub (official images)</td><td>anonymous limit per IP; log in on CI and servers</td></tr>
<tr><td>Your project's images, code on GitHub</td><td>GHCR (<code>ghcr.io/&lt;you&gt;/&lt;app&gt;</code>)</td><td>new packages are <strong>private by default</strong> — the server needs a token or you make it public</td></tr>
<tr><td>Deploying into AWS / GCP / Azure</td><td>that cloud's registry</td><td>short-lived cloud credentials, not passwords</td></tr>
<tr><td>A class lab, an offline network, a speed-up</td><td><code>registry:2</code> (+ mirror mode)</td><td>no auth/TLS by default; you own backups and garbage collection</td></tr>
</table>
<p>A student project that already works this way: a home build machine pushes <code>ghcr.io/&lt;account&gt;/api-backend-backend</code> twice per release — once as <code>:latest</code> and once as the short commit hash (<code>:0b3f8a63</code>, <code>:5b33194d</code>, …) — and the VPS pulls the commit tag. That is Lesson 3.2's "one immutable tag per build, one moving alias" in real life. GitHub's documentation says a newly published package starts private, and that public images can be pulled anonymously; in Actions, the workflow's <code>GITHUB_TOKEN</code> can push to GHCR with no stored secret.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the lab network at school is slow and the class keeps hitting <code>toomanyrequests</code> when twenty laptops pull <code>postgres</code> at once. You volunteer to run a local registry on your laptop for the group project: your team's own image lives there, and a mirror saves the Hub quota.</p><ol>
<li>Start a plain registry on <code>18030</code> with a named volume, tag any small image as <code>localhost:18030/nhom/api:1.0</code> and push it.</li>
<li>Build a second image <code>FROM</code> the same base, push it as <code>localhost:18030/nhom/web:1.0</code>, and find the <code>Mounted from</code> line.</li>
<li>List what the registry holds with <code>curl localhost:18030/v2/_catalog</code> and <code>…/v2/nhom/api/tags/list</code>.</li>
<li>Start the mirror on <code>18032</code> and time two pulls of <code>localhost:18032/library/busybox:1.36</code> as in the step-by-step above.</li>
<li>Clean up by name: <code>docker rm -f</code> both registries, <code>docker volume rm</code> their volumes, <code>docker rmi</code> the <code>localhost:…</code> tags.</li></ol>
<p><strong>Done when:</strong> the catalog lists both repositories, you can point at the layer that was mounted rather than uploaded and say why, the second mirror pull is clearly faster than the first, and <code>docker ps -a</code> shows no registry container left.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Distribution API</span><span class="v">The small HTTP API (<code>/v2/…</code>) every registry speaks — why Hub, GHCR and <code>registry:2</code> are interchangeable.</span></div>
  <div class="kv"><span class="k">Blob</span><span class="v">A stored layer or config, addressed by its digest.</span></div>
  <div class="kv"><span class="k">Cross-repository mount</span><span class="v">The registry links a blob it already holds into another repository — "Mounted from".</span></div>
  <div class="kv"><span class="k">Credential helper</span><span class="v">A program that keeps registry passwords in the OS keychain instead of base64 in <code>config.json</code>.</span></div>
  <div class="kv"><span class="k">Access token</span><span class="v">A revocable, scoped secret used instead of your account password.</span></div>
  <div class="kv"><span class="k">Rate limit</span><span class="v">The cap on pulls per time window; anonymous pulls are counted per IP.</span></div>
  <div class="kv"><span class="k">Pull-through cache (mirror)</span><span class="v">A local registry that fetches from Hub once and serves every later pull itself.</span></div>
  <div class="kv"><span class="k">Insecure registry</span><span class="v">A registry reached over plain HTTP; allowed for 127.0.0.0/8 by default, elsewhere only if listed.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A registry is a web server with one small API; switching registries means changing the name you tag with.</li>
<li><code>docker push</code> asks before uploading: layers the registry already has are skipped or mounted.</li>
<li>Without a credential helper, <code>config.json</code> keeps <code>user:password</code> as base64 — decodable by anyone who reads the file.</li>
<li>Anonymous Hub pulls are counted per IP; the header you get (<code>w=3600</code> on 23/09/2026) is what counts, not the docs.</li>
<li>A <code>registry:2</code> mirror turns twenty pulls into one and makes the rest local-speed.</li>
<li>GHCR suits code on GitHub, but new packages start private — plan the server's token.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/docker-hub/usage/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Docker Hub usage and rate limits</span><span class="lc-sub">The current numbers, how they are counted, and what an authenticated pull changes. Check this rather than trusting any tutorial's figures — including this one's.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">GitHub Container Registry</span><span class="lc-sub">Authenticating with <code>GITHUB_TOKEN</code> in Actions, making a package public, and linking it to the repository so people can find the Dockerfile. Short and worth following exactly.</span></span>
</a>
<a class="link-card" href="https://distribution.github.io/distribution/about/configuration/" target="_blank" rel="noopener">
  <span class="lc-ico">🏠</span>
  <span class="lc-body"><span class="lc-title">Running a self-hosted registry</span><span class="lc-sub">The full configuration for <code>registry:2</code>, including proxy/mirror mode, storage backends (S3, filesystem) and garbage collection — which you will need once it fills a disk.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: push and pull</span><span class="lc-sub">Graded exercises: retag an image for two registries, read your remaining pull quota from the response headers, stand up a local registry and push to it, and explain why <code>Mounted from</code> appeared instead of an upload.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>denied: requested access to the resource is denied</code> on push, when you are definitely logged in. Almost always the image name does not match the destination: pushing <code>demo:1.0</code> tries <code>docker.io/library/demo</code> — the official-images namespace, which you do not own. The repository name must contain the account: <code>docker tag demo:1.0 cuonghoang1103/demo:1.0</code>, or <code>ghcr.io/cuonghoang1103/demo:1.0</code>. On GHCR there is a second variant of this: the push succeeds but the package is private by default, so a pull from your server fails with <code>unauthorized</code> until you make it public or give the server a token.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A registry is just an HTTP API, so Hub, GHCR and a <code>registry:2</code> container are interchangeable — the only thing that changes is the name you tag with. <code>~/.docker/config.json</code> stores credentials as base64, not encrypted, so use access tokens, <code>--password-stdin</code>, and a credential helper on any machine you share. And Hub's rate limits are counted per IP for anonymous pulls, which is why a CI pool or an office NAT hits them: authenticate, host your own images elsewhere, and put a pull-through mirror in front.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Registry: Hub, GHCR và của riêng bạn</h2>
<p class="lead">Một registry là một máy chủ web nói đúng MỘT cái API HTTP tiêu chuẩn nhỏ để lưu và phục vụ các tầng ảnh. Đó là toàn bộ ý tưởng — và đó là lý do Docker Hub, registry của GitHub, AWS ECR và một container do chính bạn chạy đều thay thế được cho nhau dưới góc nhìn của <code>docker pull</code>.</p>

<h3>Đăng nhập, và mật khẩu đi đâu</h3>
${slide('dk-03', 16, 'config.json: mật khẩu chỉ được base64 — không phải mã hoá')}
<pre><code>echo "\$DOCKER_TOKEN" | docker login -u cuonghoang1103 --password-stdin
cat ~/.docker/config.json</code></pre>
<div class="out">Login Succeeded
{
  "auths": {
    "https://index.docker.io/v1/": {
      "auth": "Y3Vvbmdob2FuZzExMDM6ZGNrcl9wYXRfeFhZWjEyMw=="
    }
  }
}</div>
<div class="callout warn"><strong>Cái trường <code>auth</code> kia là base64, KHÔNG phải mã hoá.</strong> <code>echo '…' | base64 -d</code> in ra <code>tên_người_dùng:token</code> bằng chữ thường. Bất cứ ai đọc được <code>~/.docker/config.json</code> — một bản sao lưu, một cái máy dùng chung, một container mà bạn gắn thư mục nhà vào — đều có thông tin đăng nhập registry của bạn. Hai điều rút ra: hãy dùng access token thay cho mật khẩu tài khoản (thu hồi được, giới hạn phạm vi được), và trên máy làm việc thì hãy cài một credential helper để bí mật nằm trong keychain của hệ điều hành thay vì trong file:
<pre><code><span class="tok-comment"># Linux: nền pass/gpg  ·  macOS: Keychain  ·  Windows: Credential Manager</span>
sudo apt install -y golang-docker-credential-helpers   <span class="tok-comment"># Ubuntu/Debian package name</span>
printf '{"credsStore":"pass"}\\n' &gt; ~/.docker/config.json
docker login          <span class="tok-comment"># token giờ vào keychain, không vào file</span></code></pre></div>
<p class="note-ct">Đính chính: trên Ubuntu, gói tên là <code>golang-docker-credential-helpers</code> (đã kiểm trên packages.ubuntu.com cho bản 24.04); gói <code>docker-credential-helpers</code> không tồn tại ở đó. Helper <code>pass</code> còn cần một khoá GPG và chạy <code>pass init &lt;id-khoá&gt;</code> một lần trước lần đăng nhập đầu. Trên Docker Desktop thì không cần gì cả — máy Mac đã tự cất thông tin đăng nhập vào Keychain.</p>
<h3>Chạy thử từng bước: nhìn thấy mật khẩu của mình dưới dạng chữ thường (một cách an toàn)</h3>
<p>Lời cảnh báo cứ trừu tượng cho tới khi bạn tự giải mã một file thật. Hãy làm với một registry vứt đi và một mật khẩu vứt đi, trong một thư mục cấu hình <em>RIÊNG</em> để lượt đăng nhập thật của bạn không bị đụng tới. <code>htpasswd</code> có sẵn trên macOS (trên Linux: gói <code>apache2-utils</code> / <code>httpd-tools</code>):</p>
<pre><code class="language-bash">mkdir -p ~/thu-docker/auth &amp;&amp; cd ~/thu-docker
htpasswd -Bbn cuong matkhau123 &gt; auth/htpasswd
docker run -d --name reg-auth -p 18031:5000 -v "$PWD/auth:/auth" \\
  -e REGISTRY_AUTH=htpasswd -e REGISTRY_AUTH_HTPASSWD_REALM=thu \\
  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd registry:2
export DOCKER_CONFIG=/tmp/thu-cfg; mkdir -p $DOCKER_CONFIG     <span class="tok-comment"># cấu hình nháp, không phải ~/.docker</span>
echo matkhau123 | docker login localhost:18031 -u cuong --password-stdin
cat $DOCKER_CONFIG/config.json
echo Y3Vvbmc6bWF0a2hhdTEyMw== | base64 -d; echo</code></pre>
<p>Trên máy Linux của khoá (không cài credential helper nào), output là:</p>
<div class="out">Login Succeeded

WARNING! Your credentials are stored unencrypted in '/tmp/dk03/cfg/config.json'.
Configure a credential helper to remove this warning. See
https://docs.docker.com/go/credential-store/

{
	"auths": {
		"localhost:18031": {
			"auth": "Y3Vvbmc6bWF0a2hhdTEyMw=="
		}
	}
}
cuong:matkhau123</div>
<p>Docker còn cảnh báo bạn, và quyền của file là <code>-rw-------</code> (chỉ bạn đọc được) — nhưng mọi bản sao lưu, mọi container bạn gắn thư mục nhà vào, và mọi script chạy dưới tên bạn thì đọc được. Trên máy Mac, cùng lượt đăng nhập đó không in cảnh báo nào và file chỉ ghi <code>"credsStore": "osxkeychain"</code> với một mục rỗng: bí mật đã vào Keychain. File <code>~/.docker/config.json</code> thật của bạn trên Docker Desktop ghi <code>"credsStore": "desktop"</code> cũng vì lý do đó. Kết thúc bằng <code>docker logout localhost:18031</code>, <code>unset DOCKER_CONFIG</code> và <code>docker rm -f reg-auth</code>.</p>
<table>
<tr><th>Thành phần</th><th>Nghĩa</th></tr>
<tr><td><code>htpasswd -Bbn user pass</code></td><td><code>-B</code> băm bcrypt (loại duy nhất <code>registry:2</code> nhận) · <code>-b</code> mật khẩu trên dòng lệnh · <code>-n</code> in ra thay vì ghi file</td></tr>
<tr><td><code>REGISTRY_AUTH=htpasswd</code></td><td>bật xác thực cơ bản cho <code>registry:2</code></td></tr>
<tr><td><code>DOCKER_CONFIG=…</code></td><td>bảo CLI dùng một thư mục khác <code>~/.docker</code> — rất hợp để thử nghiệm và cho các job CI</td></tr>
<tr><td><code>--password-stdin</code></td><td>đọc bí mật từ ống dẫn, nên nó không bao giờ nằm trong lịch sử shell hay <code>ps</code></td></tr>
</table>

<div class="kv-grid">
  <div class="kv"><span class="k">--password-stdin, LUÔN LUÔN</span><span class="v"><code>docker login -p "\$TOKEN"</code> đặt cái token vào lịch sử shell của bạn, vào output <code>ps</code> mà mọi người dùng trên máy đều thấy, và vào log CI. Đổ nó qua ống dẫn tránh được cả ba, và số phím gõ thì bằng nhau.</span></div>
  <div class="kv"><span class="k">Access token, không phải mật khẩu</span><span class="v">Hãy tạo chúng theo từng máy và từng mục đích. Chúng thu hồi được riêng lẻ, giới hạn được thành chỉ-đọc, và chúng vẫn chạy khi bạn bật 2FA — điều mà một mật khẩu thì không.</span></div>
  <div class="kv"><span class="k">docker logout trên máy dùng chung</span><span class="v">Nhất là những máy chạy CI mà bạn không sở hữu độc quyền. Không thì file thông tin đăng nhập sống sót qua cả công việc đó.</span></div>
  <div class="kv"><span class="k">CI có lựa chọn tốt hơn</span><span class="v">GitHub Actions cấp cho mỗi workflow một <code>GITHUB_TOKEN</code> giới hạn phạm vi, đẩy được lên GHCR mà không phải quản lý bí mật nào; ECR và GCR dùng thông tin đăng nhập đám mây ngắn hạn. Hãy ưu tiên chúng hơn một token cá nhân sống lâu nằm trong kho bí mật.</span></div>
</div>

<h3>Đẩy một cái ảnh lên</h3>
${slide('dk-03', 14, 'Registry chỉ là một API HTTP — đẩy là vài lệnh PUT')}
<pre><code><span class="tok-comment"># Tên kho phải KHỚP với nơi nó sắp đi — gắn tag trước, rồi push</span>
docker pull alpine:3.20
docker tag alpine:3.20 cuonghoang1103/demo:1.0
docker push cuonghoang1103/demo:1.0

<span class="tok-comment"># Cùng cái ảnh, một registry khác: chỉ là một cái tên khác</span>
docker tag alpine:3.20 ghcr.io/cuonghoang1103/demo:1.0
echo "\$GH_TOKEN" | docker login ghcr.io -u cuonghoang1103 --password-stdin
docker push ghcr.io/cuonghoang1103/demo:1.0</code></pre>
<div class="out">The push refers to repository [docker.io/cuonghoang1103/demo]
63ca1fbb43ae: Mounted from library/alpine
1.0: digest: sha256:a606584aa9aa1f0b4c3d2e1f0a9b8c7d6e5f4a39281706f5e4d3c2b1a09f8e7d6 size: 527</div>
<p><code>Mounted from library/alpine</code> là registry đang nói với bạn rằng nó ĐÃ CÓ cái tầng đó và không cần tải lên. Đẩy một ảnh 200MB dựng trên một ảnh nền phổ biến thì chỉ những tầng của riêng bạn thật sự đi qua đường truyền — đó là cơ chế lưu-theo-nội-dung của Bài 1.2 sinh lời trên mạng.</p>
<p class="note-ct">Output push (lên Docker Hub) ở trên chỉ để minh hoạ — khoá này không đẩy lên tài khoản thật, và dòng digest của nó không đến từ một lần chạy thật. Dưới đây là đúng cơ chế đó, ghi lại thật với một <code>registry:2</code> cục bộ.</p>
<h3>docker push thật ra gửi đi những gì — nhìn trên registry của chính bạn</h3>
${slide('dk-03', 15, 'Tầng registry đã có ⇒ Mounted from, không tải lên lại')}
<p>Một lượt push không phải là một lần tải lên. Với mỗi tầng, máy khách hỏi trước "anh có <code>sha256:…</code> chưa?" (<code>HEAD /v2/&lt;kho&gt;/blobs/&lt;digest&gt;</code>). Chỉ những tầng còn thiếu mới được tải lên (<code>POST</code> rồi <code>PUT /v2/&lt;kho&gt;/blobs/uploads/…</code>). Nếu registry đang giữ tầng đó ở một kho <em>KHÁC</em>, máy khách xin nó <strong>mount (gắn chéo)</strong> blob sang thay vì gửi. Cuối cùng là <code>PUT /v2/&lt;kho&gt;/manifests/&lt;tag&gt;</code>: tới lúc này cái tag mới tồn tại. Trên máy Mac của khoá, với một registry ở cổng 18030 đã chứa sẵn <code>goc/alpine</code> và <code>dk03-web</code>:</p>
<pre><code class="language-bash">docker build -t localhost:18030/nhom/dk03-api:1.0 .     <span class="tok-comment"># FROM alpine:3.20 + một lệnh COPY</span>
docker push localhost:18030/nhom/dk03-api:1.0</code></pre>
<div class="out">The push refers to repository [localhost:18030/nhom/dk03-api]
af79558cf9ed: Pushed
3f26bc2dec0b: Mounted from goc/alpine
8ff4d425b3ee: Pushed
44136fa355b3: Mounted from dk03-web
1.0: digest: sha256:a00cf050ee0d2feaa229e0bcce8c8f26b583e6f3252a7faac62c1f11b9f194c2 size: 855</div>
<table>
<tr><th>Dòng</th><th>Chuyện gì xảy ra trên đường truyền</th></tr>
<tr><td><code>Pushed</code></td><td>registry chưa có blob này ở đâu cả — nó đã được tải lên</td></tr>
<tr><td><code>Mounted from goc/alpine</code></td><td>blob đã có ở một kho khác; 0 byte được gửi, chỉ là một liên kết</td></tr>
<tr><td><code>Layer already exists</code></td><td>(không có ở đây) blob đã có sẵn trong <em>chính</em> kho này</td></tr>
<tr><td><code>1.0: digest: … size: 855</code></td><td>manifest/chỉ mục đã được PUT dưới tag <code>1.0</code>; 855 = độ dài của nó tính bằng byte</td></tr>
</table>
<p>Terminal lúc đang chạy còn hiện những dòng như <code>3f26bc2dec0b: Waiting</code> và <code>Unavailable</code> lặp lại nhiều lần trong khi các lượt đẩy chạy song song — đó là tiếng ồn tiến độ, không phải lỗi; <code>docker push -q</code> chỉ in ra cái tên cuối cùng. Thêm một dòng thật đáng biết, từ lúc đẩy chính <code>alpine:3.20</code>:</p>
<div class="out"> Info -&gt; Not all multiplatform-content is present and only the available single-platform image was pushed
         sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc -&gt; sha256:45e09956dc667c5eff3583c9d94830261fb1ca0be10a0a7db36266edf5de9e1d</div>
<p>Trên Docker 29, <code>alpine:3.20</code> cục bộ của bạn là trọn một chỉ mục đa nền tảng, nhưng chỉ có các tầng arm64 từng được tải về máy Mac. Docker không đẩy được tầng nó không có, nên nó đẩy một ảnh <em>MỘT nền tảng</em> với digest mới và nói cho bạn biết. Nếu bạn gắn lại tag một ảnh chính thức rồi đẩy lên registry của mình với kỳ vọng nó vẫn đa kiến trúc, thì đây là dòng báo rằng nó KHÔNG còn nữa — hãy dùng <code>docker buildx imagetools create</code> để chép một chỉ mục từ registry sang registry.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Docker Hub</span><span class="v"><code>người_dùng/ảnh</code>. Kho công khai miễn phí, một kho riêng tư miễn phí, và giới hạn tần suất kéo có ảnh hưởng thật (ở dưới). Là mặc định, và ngày càng không phải lựa chọn tốt nhất cho CI.</span></div>
  <div class="kv"><span class="k">GHCR — ghcr.io</span><span class="v"><code>ghcr.io/chủ_sở_hữu/ảnh</code>. Miễn phí cho ảnh công khai, hào phóng với ảnh riêng tư, không có giới hạn kéo đáng kể, và nó liên kết tới kho mã đã dựng ra nó. Nếu mã của bạn nằm trên GitHub thì đây là con đường ít trở lực nhất.</span></div>
  <div class="kv"><span class="k">Registry của đám mây</span><span class="v">ECR, Artifact Registry, ACR. Cùng API; xác thực là một thông tin đăng nhập đám mây chứ không phải mật khẩu. Đúng khi đích triển khai của bạn là chính đám mây đó.</span></div>
  <div class="kv"><span class="k">Tự dựng</span><span class="v">Ảnh <code>registry:2</code>, Harbor, hay registry có sẵn của Gitea. Toàn quyền kiểm soát, không giới hạn tần suất, và bạn tự lo phần sao lưu với chứng chỉ TLS.</span></div>
</div>

<h3>Giới hạn tần suất kéo</h3>
${slide('dk-03', 17, 'Docker Hub đếm lượt kéo — ẩn danh thì đếm theo IP')}
<pre><code>curl -s "https://auth.docker.io/token?service=registry.docker.io&amp;scope=repository:library/alpine:pull" \\
  | jq -r .token \\
  | { read T; curl -sI -H "Authorization: Bearer \$T" \\
      https://registry-1.docker.io/v2/library/alpine/manifests/latest \\
      | grep -i ratelimit; }</code></pre>
<div class="out">ratelimit-limit: 100;w=21600
ratelimit-remaining: 76;w=21600</div>
<p>Những lượt kéo ẩn danh từ Docker Hub được đếm <strong>THEO ĐỊA CHỈ IP NGUỒN</strong> trong một cửa sổ trượt. Trên một đường mạng nhà thì hạn mức đó rộng rãi; trên một cái NAT văn phòng dùng chung, một cổng NAT của đám mây hay một bể máy chạy CI thì đó là một ngân sách CHIA CHUNG, và kiểu hỏng là <code>toomanyrequests: You have reached your pull rate limit</code> ngay giữa một bản deploy. Docker đổi những con số này theo thời gian — câu lệnh ở trên báo cáo đúng giới hạn đang áp cho bạn NGAY LÚC NÀY, và điều đó hơn mọi tài liệu.</p>
<p>Các con số, đúng như trang chính thức ghi (đã kiểm trên docs.docker.com, <strong>tính đến 09/2026</strong>):</p>
<table>
<tr><th>Ai đang kéo</th><th>Giới hạn kéo</th></tr>
<tr><td>Không đăng nhập</td><td>100 lượt / 6 giờ, cho mỗi địa chỉ IPv4 hoặc mỗi dải IPv6 /64</td></tr>
<tr><td>Personal (tài khoản miễn phí, đã đăng nhập)</td><td>200 lượt / 6 giờ</td></tr>
<tr><td>Pro, Team, Business</td><td>không giới hạn (áp chính sách dùng hợp lý)</td></tr>
</table>
<p>Cách đếm một "lượt kéo" quan trọng không kém con số: kéo một ảnh đa kiến trúc bị tính <strong>một lượt cho mỗi kiến trúc</strong> bạn tải về, lượt kiểm phiên bản không bị tính, và một yêu cầu <code>HEAD</code> lên manifest không bị tính (còn <code>GET</code> thì có) — đó là lý do lệnh kiểm dùng <code>curl -I</code>. Giờ tới phần cho thấy vì sao bài này nói "hãy tin cái header": cùng phép kiểm đó, chạy thật từ máy Mac của khoá ngày 23/09/2026, ẩn danh, qua mạng nhà, với kho thử chính thức:</p>
<pre><code class="language-bash">T=$(curl -s "https://auth.docker.io/token?service=registry.docker.io&amp;scope=repository:ratelimitpreview/test:pull" | jq -r .token)
curl -s --head -H "Authorization: Bearer $T" \\
  https://registry-1.docker.io/v2/ratelimitpreview/test/manifests/latest | grep -i '^ratelimit'</code></pre>
<div class="out">ratelimit-limit: 100;w=3600
ratelimit-remaining: 32;w=3600</div>
<p><code>w=3600</code> là một cửa sổ <em>MỘT giờ</em>, không phải sáu giờ (<code>w=21600</code>) như tài liệu và output cũ phía trên mô tả. Tài liệu và máy chủ đang nói hai điều khác nhau; cái header là thứ máy chủ đang áp lên bạn ngay lúc đó. Và việc chỉ còn <code>32</code> trên 100 ở mạng nhà cho thấy một ngân sách chia chung theo IP cạn nhanh thế nào — chiều hôm đó có mấy máy và mấy job dựng trên cùng mạng đã kéo ảnh. (Phản hồi còn có header <code>docker-ratelimit-source</code> chứa IP công khai của bạn; khoá đã cắt nó khỏi output.)</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Xác thực, kể cả với ảnh công khai</span><span class="lz-t">docker login trong CI</span><span class="lz-d">Một lượt kéo có xác thực được tính vào tài khoản của bạn thay vì cái IP dùng chung, và điều đó lập tức loại bỏ kiểu hỏng "ai đó trên cùng NAT này đã xài hết hạn mức".</span></div>
  <div class="lz-step"><span class="lz-k">2 · Chuyển ảnh của CHÍNH BẠN ra khỏi Hub</span><span class="lz-t">ghcr.io, hoặc registry của đám mây bạn dùng</span><span class="lz-d">Ảnh của bạn mới là thứ bạn kéo nhiều nhất. Ảnh nền từ Hub chiếm phần nhỏ hơn hẳn trong ngân sách.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Chạy một bộ đệm kéo xuyên</span><span class="lz-t">một registry:2 ở chế độ gương</span><span class="lz-d">Một cái máy kéo từ Hub; mọi máy khác kéo từ nó. Cắt số lượt xuống gần bằng không và làm việc kéo nhanh hơn rất nhiều trên đường truyền chậm — thắng lợi lớn nhất cho một đội ở Việt Nam kéo từ một registry đặt tại Mỹ.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Đừng kéo thứ bạn đã có</span><span class="lz-t">tránh --pull=always ở chỗ không cần</span><span class="lz-d">Một ảnh đã ghim digest thì không bao giờ cần kéo lại. Script deploy ở Chương 11 kéo đúng MỘT lần cho mỗi bản phát hành.</span></div>
</div>

<h3>Registry của riêng bạn, bằng một câu lệnh</h3>
${slide('dk-03', 18, 'Gương kéo xuyên: cả nhóm kéo từ một máy trong mạng')}
<pre><code>docker run -d --name registry -p 5000:5000 -v regdata:/var/lib/registry registry:2
docker tag alpine:3.20 localhost:5000/alpine:3.20
docker push localhost:5000/alpine:3.20
curl -s localhost:5000/v2/_catalog; echo
curl -s localhost:5000/v2/alpine/tags/list; echo</code></pre>
<div class="out">{"repositories":["alpine"]}
{"name":"alpine","tags":["3.20"]}</div>
<p>Đó là một registry hoàn chỉnh và đúng chuẩn: nó nói cùng cái API với Docker Hub, và <code>docker pull localhost:5000/alpine:3.20</code> chạy được từ bất cứ đâu với tới nó. Nó không có xác thực và không có TLS, nên nó dành cho một cái laptop hoặc một mạng riêng — Harbor hay một reverse proxy có basic auth là bước tiếp theo.</p>
<pre><code><span class="tok-comment"># Một bộ đệm kéo xuyên — /etc/docker/daemon.json trên MỌI máy</span>
{
  "registry-mirrors": ["http://registry-cache.internal:5000"],
  "live-restore": true
}
<span class="tok-comment"># và chính cái bộ đệm:</span>
docker run -d --name cache -p 5000:5000 -v cachedata:/var/lib/registry \\
  -e REGISTRY_PROXY_REMOTEURL=https://registry-1.docker.io registry:2</code></pre>
<div class="callout"><strong>Một cái gương thì TRONG SUỐT.</strong> Khi đã đặt <code>registry-mirrors</code>, lệnh <code>docker pull nginx</code> ở mọi nơi vẫn cứ ghi là <code>nginx</code> — không phải sửa Dockerfile, file Compose hay script nào. Tiến trình nền thử cái gương trước và lùi về Hub nếu không với tới được. Lưu ý nó CHỈ áp cho ảnh của Docker Hub: một cái gương không chặn được những lượt kéo <code>ghcr.io/...</code>, chúng cần mục gương riêng hoặc không có gương nào.</div>


<h3>Chạy thử từng bước: một gương kéo xuyên ngay trên laptop, có đo</h3>
<p>Bạn cảm nhận được một cái gương đem lại gì mà không cần đụng tới <code>daemon.json</code>: chạy một cái và kéo <em>XUYÊN</em> qua nó bằng tên. Đường dẫn phải có <code>library/</code> với ảnh chính thức, vì giờ bạn đang nói chuyện trực tiếp với registry của mình và các mặc định của Docker Hub không còn áp dụng:</p>
<pre><code class="language-bash">docker run -d --name mirror -p 18032:5000 \\
  -e REGISTRY_PROXY_REMOTEURL=https://registry-1.docker.io registry:2
time docker pull -q localhost:18032/library/busybox:1.36     <span class="tok-comment"># lần 1: gương đi lấy từ Hub</span>
docker rmi localhost:18032/library/busybox:1.36
time docker pull -q localhost:18032/library/busybox:1.36     <span class="tok-comment"># lần 2: lấy từ đĩa của gương</span></code></pre>
<div class="out">localhost:18032/library/busybox:1.36
docker pull -q localhost:18032/library/busybox:1.36  0.02s user 0.02s system 0% cpu 8.925 total
localhost:18032/library/busybox:1.36
docker pull -q localhost:18032/library/busybox:1.36  0.02s user 0.02s system 1% cpu 2.794 total</div>
<p>8,9 giây → 2,8 giây cho một ảnh 2 MB trên máy Mac của khoá; với một ảnh <code>node</code> hay <code>sonarqube</code> cỡ 1 GB trên đường mạng chậm thì chênh lệch là hàng phút, và chỉ lần kéo đầu tiên bị tính vào giới hạn của Docker Hub. Có hai bất ngờ thật dọc đường: lần thử đầu tiên hỏng với <code>dial tcp [::1]:18032: i/o timeout</code> vì container chưa khởi động xong — hãy đợi một giây sau <code>docker run -d</code>; và <code>curl localhost:18032/v2/_catalog</code> vẫn trả <code>{"repositories":[]}</code> kể cả khi bộ đệm đã có dữ liệu, nên đừng dùng catalog để phán xem gương có chạy không — hãy đo thời gian kéo.</p>
<table>
<tr><th>Thiết lập</th><th>Tác dụng</th></tr>
<tr><td><code>REGISTRY_PROXY_REMOTEURL</code></td><td>biến <code>registry:2</code> thành một bộ đệm chỉ-đọc của nguồn đó</td></tr>
<tr><td><code>REGISTRY_PROXY_USERNAME</code> / <code>_PASSWORD</code></td><td>cho gương kéo dưới tài khoản của bạn — khi đó lượt kéo của nó tính vào hạn mức (cao hơn) của bạn</td></tr>
<tr><td><code>"registry-mirrors"</code> trong <code>daemon.json</code></td><td>khiến mọi <code>docker pull nginx</code> trên máy đó thử gương trước — không phải đổi tên gì</td></tr>
<tr><td><code>-v cachedata:/var/lib/registry</code></td><td>giữ bộ đệm qua các lần khởi động lại container; thiếu nó thì mỗi lần khởi động lại là bắt đầu nguội</td></tr>
</table>
<h3>Nói chuyện với một registry không bảo mật</h3>
<pre><code><span class="tok-comment"># /etc/docker/daemon.json — cho một registry chạy HTTP thuần trên mạng riêng</span>
{ "insecure-registries": ["registry.internal:5000"] }</code></pre>
<pre><code>sudo systemctl restart docker
docker info --format '{{json .RegistryConfig.IndexConfigs}}' | tr ',' '\\n' | head -3</code></pre>
<div class="out">{"docker.io":{"Name":"docker.io"
"Mirrors":[]
"Secure":true</div>
<p>Docker mặc định TỪ CHỐI HTTP thuần, và điều đó là đúng — một registry HTTP không xác thực có thể bị bất cứ ai trên đường truyền tráo bằng một cái độc hại. <code>insecure-registries</code> là một lối thoát TƯỜNG MINH, theo từng máy chủ, cho một mạng do bạn kiểm soát. Lưu ý <code>localhost</code> được miễn trừ tự động, và đó là lý do ví dụ ở trên chạy được mà không cần cấu hình gì.</p>
<p>Bạn xem được ngoại lệ dựng sẵn này ngay trên máy mình mà không phải đổi gì — đây là máy Mac của khoá:</p>
<pre><code class="language-bash">docker info --format '{{json .RegistryConfig.InsecureRegistryCIDRs}}'</code></pre>
<div class="out">["::1/128","127.0.0.0/8"]</div>
<p>Đó là lý do mọi lượt đẩy <code>localhost:18030/…</code> trong chương này chạy được qua HTTP thường. Một registry trên máy khác trong mạng của bạn — ví dụ laptop của bạn cùng nhóm ở <code>192.168.1.20:5000</code> — không nằm trong danh sách đó, và lỗi sẽ là <code>http: server gave HTTP response to HTTPS client</code> cho tới khi bạn thêm nó vào <code>insecure-registries</code> (Docker Desktop: Settings → Docker Engine) hoặc đặt TLS phía trước.</p>

<pre><code>docker rm -f registry &gt;/dev/null; docker volume rm regdata &gt;/dev/null
docker rmi localhost:5000/alpine:3.20 cuonghoang1103/demo:1.0 &gt;/dev/null 2&gt;&amp;1</code></pre>


<h3>Registry nào, khi nào</h3>
<table>
<tr><th>Bạn cần…</th><th>Dùng</th><th>Cẩn thận</th></tr>
<tr><td>Ảnh nền công khai</td><td>Docker Hub (ảnh chính thức)</td><td>giới hạn ẩn danh theo IP; đăng nhập trên CI và máy chủ</td></tr>
<tr><td>Ảnh của dự án, mã nằm trên GitHub</td><td>GHCR (<code>ghcr.io/&lt;bạn&gt;/&lt;app&gt;</code>)</td><td>gói mới mặc định là <strong>RIÊNG TƯ</strong> — máy chủ cần token, hoặc bạn đặt nó công khai</td></tr>
<tr><td>Deploy vào AWS / GCP / Azure</td><td>registry của chính đám mây đó</td><td>thông tin đăng nhập đám mây ngắn hạn, không phải mật khẩu</td></tr>
<tr><td>Phòng lab ở trường, mạng không Internet, cần tăng tốc</td><td><code>registry:2</code> (+ chế độ gương)</td><td>mặc định không có xác thực/TLS; bạn tự lo sao lưu và dọn rác</td></tr>
</table>
<p>Một dự án sinh viên đã chạy đúng kiểu này: máy dựng ở nhà đẩy <code>ghcr.io/&lt;tài-khoản&gt;/api-backend-backend</code> hai lần mỗi bản phát hành — một lần là <code>:latest</code> và một lần là mã commit rút gọn (<code>:0b3f8a63</code>, <code>:5b33194d</code>, …) — và VPS kéo tag theo commit. Đó chính là "mỗi lượt dựng một tag bất biến, cộng một bí danh dời được" của Bài 3.2 ngoài đời thật. Tài liệu của GitHub ghi rằng một gói mới công bố bắt đầu ở chế độ riêng tư, và ảnh công khai thì kéo ẩn danh được; trong Actions, <code>GITHUB_TOKEN</code> của workflow đẩy được lên GHCR mà không cần cất bí mật nào.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> mạng phòng lab ở trường chậm và cả lớp cứ dính <code>toomanyrequests</code> khi hai mươi cái laptop cùng kéo <code>postgres</code>. Bạn xung phong chạy một registry cục bộ trên laptop cho đồ án nhóm: ảnh của nhóm nằm ở đó, và một cái gương để tiết kiệm hạn mức Hub.</p><ol>
<li>Chạy một registry thường ở cổng <code>18030</code> với volume có tên, gắn tag một ảnh nhỏ bất kỳ thành <code>localhost:18030/nhom/api:1.0</code> và đẩy lên.</li>
<li>Dựng ảnh thứ hai <code>FROM</code> cùng ảnh nền, đẩy lên thành <code>localhost:18030/nhom/web:1.0</code>, và tìm dòng <code>Mounted from</code>.</li>
<li>Liệt kê registry đang giữ gì bằng <code>curl localhost:18030/v2/_catalog</code> và <code>…/v2/nhom/api/tags/list</code>.</li>
<li>Chạy gương ở cổng <code>18032</code> và đo hai lần kéo <code>localhost:18032/library/busybox:1.36</code> như mục chạy thử ở trên.</li>
<li>Dọn theo tên: <code>docker rm -f</code> cả hai registry, <code>docker volume rm</code> volume của chúng, <code>docker rmi</code> các tag <code>localhost:…</code>.</li></ol>
<p><strong>Đạt khi:</strong> catalog liệt kê cả hai kho, bạn chỉ được tầng nào được mount thay vì tải lên và nói được vì sao, lần kéo thứ hai qua gương nhanh hơn hẳn lần đầu, và <code>docker ps -a</code> không còn container registry nào.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Distribution API (API phân phối)</span><span class="v">Bộ API HTTP nhỏ (<code>/v2/…</code>) mà mọi registry đều nói — lý do Hub, GHCR và <code>registry:2</code> thay thế được cho nhau.</span></div>
  <div class="kv"><span class="k">Blob (khối dữ liệu)</span><span class="v">Một tầng hoặc config được lưu, gọi bằng digest của nó.</span></div>
  <div class="kv"><span class="k">Cross-repository mount (gắn chéo kho)</span><span class="v">Registry liên kết một blob nó đã có sang một kho khác — dòng "Mounted from".</span></div>
  <div class="kv"><span class="k">Credential helper (trình giữ mật khẩu)</span><span class="v">Chương trình cất mật khẩu registry vào keychain của hệ điều hành thay vì base64 trong <code>config.json</code>.</span></div>
  <div class="kv"><span class="k">Access token (mã truy cập)</span><span class="v">Bí mật thu hồi được, giới hạn quyền được, dùng thay mật khẩu tài khoản.</span></div>
  <div class="kv"><span class="k">Rate limit (giới hạn tần suất)</span><span class="v">Trần số lượt kéo trong một cửa sổ thời gian; kéo ẩn danh bị đếm theo IP.</span></div>
  <div class="kv"><span class="k">Pull-through cache / mirror (gương kéo xuyên)</span><span class="v">Registry cục bộ lấy từ Hub một lần rồi tự phục vụ mọi lượt kéo sau.</span></div>
  <div class="kv"><span class="k">Insecure registry (registry không bảo mật)</span><span class="v">Registry nói HTTP thường; mặc định chỉ được phép với 127.0.0.0/8, chỗ khác phải khai báo.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Registry là một web server với một API nhỏ; đổi registry nghĩa là đổi cái tên bạn gắn tag.</li>
<li><code>docker push</code> hỏi trước khi tải: tầng nào registry đã có thì bỏ qua hoặc mount chéo.</li>
<li>Không có credential helper, <code>config.json</code> giữ <code>user:mật-khẩu</code> dạng base64 — ai đọc được file là giải được.</li>
<li>Lượt kéo ẩn danh trên Hub bị đếm theo IP; cái header bạn nhận (<code>w=3600</code> ngày 23/09/2026) mới là thứ tính, không phải tài liệu.</li>
<li>Một gương <code>registry:2</code> biến hai mươi lượt kéo thành một và làm phần còn lại nhanh như mạng nội bộ.</li>
<li>GHCR hợp khi mã nằm trên GitHub, nhưng gói mới mặc định riêng tư — hãy tính trước token cho máy chủ.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/docker-hub/usage/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Mức dùng và giới hạn tần suất của Docker Hub</span><span class="lc-sub">Những con số hiện hành, cách chúng được đếm, và một lượt kéo có xác thực thay đổi điều gì. Hãy kiểm ở đây thay vì tin số liệu của bất kỳ bài hướng dẫn nào — kể cả bài này.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">GitHub Container Registry</span><span class="lc-sub">Xác thực bằng <code>GITHUB_TOKEN</code> trong Actions, đặt một gói thành công khai, và liên kết nó với kho mã để người ta tìm được Dockerfile. Ngắn và đáng làm theo từng bước.</span></span>
</a>
<a class="link-card" href="https://distribution.github.io/distribution/about/configuration/" target="_blank" rel="noopener">
  <span class="lc-ico">🏠</span>
  <span class="lc-body"><span class="lc-title">Chạy một registry tự dựng</span><span class="lc-sub">Cấu hình đầy đủ cho <code>registry:2</code>, gồm chế độ proxy/gương, các nền lưu trữ (S3, hệ thống file) và thu gom rác — thứ bạn sẽ cần một khi nó làm đầy một cái đĩa.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đẩy và kéo</span><span class="lc-sub">Bài chấm điểm: gắn lại tag một cái ảnh cho hai registry, đọc hạn mức kéo còn lại từ tiêu đề phản hồi, dựng một registry cục bộ rồi đẩy lên nó, và giải thích vì sao <code>Mounted from</code> hiện ra thay cho một lượt tải lên.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>denied: requested access to the resource is denied</code> khi push, trong lúc bạn chắc chắn đã đăng nhập. Gần như luôn là tên ảnh không khớp với đích đến: đẩy <code>demo:1.0</code> là đang thử <code>docker.io/library/demo</code> — không gian tên của ảnh chính thức, thứ bạn không sở hữu. Tên kho phải chứa tài khoản: <code>docker tag demo:1.0 cuonghoang1103/demo:1.0</code>, hoặc <code>ghcr.io/cuonghoang1103/demo:1.0</code>. Trên GHCR còn có một biến thể thứ hai: lệnh push THÀNH CÔNG nhưng gói mặc định là riêng tư, nên một lượt kéo từ máy chủ của bạn hỏng với <code>unauthorized</code> cho tới khi bạn đặt nó thành công khai hoặc cấp cho máy chủ một cái token.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Một registry chỉ là một API HTTP, nên Hub, GHCR và một container <code>registry:2</code> thay thế được cho nhau — thứ duy nhất thay đổi là cái tên bạn gắn tag. <code>~/.docker/config.json</code> cất thông tin đăng nhập dưới dạng base64, KHÔNG mã hoá, nên hãy dùng access token, <code>--password-stdin</code>, và một credential helper trên mọi máy bạn dùng chung. Và giới hạn của Hub được đếm theo IP với những lượt kéo ẩn danh, đó là lý do một bể CI hay một cái NAT văn phòng đụng trần: hãy xác thực, đặt ảnh của mình ở chỗ khác, và dựng một cái gương kéo xuyên ở phía trước.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — Multi-architecture images and exec format error|||3.4 — Ảnh đa kiến trúc và lỗi exec format error',
      slug: 'dk-3-4-da-kien-truc',
      type: 'LESSON',
      description: 'Vì sao một ảnh dựng trên MacBook M-series lại chết trên VPS, đọc một chỉ mục đa nền tảng, --platform và mô phỏng QEMU, dựng cho hai kiến trúc bằng buildx, và cái giá thật của việc mô phỏng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Multi-architecture images and exec format error</h2>
<p class="lead">A container shares the host kernel and runs native machine code (Lesson 1.1), so an image is architecture-specific. Since Apple moved to ARM and most servers stayed on x86, this stopped being a niche concern and became the single most common "it built fine and the server refuses to start it" story.</p>

<h3>The failure, in full</h3>
${slide('dk-03', 19, 'Ảnh sai kiến trúc chết theo hai kiểu khác nhau')}
<div class="out">$ docker run --rm myapp:1.0
exec /usr/local/bin/node: exec format error

$ docker inspect myapp:1.0 --format '{{.Os}}/{{.Architecture}}'
linux/arm64

$ uname -m
x86_64</div>
<p>The kernel was handed an ARM64 binary on an x86-64 machine and refused it. The message is terse and correct: the executable's format is not one this CPU can run. Nothing is corrupted, the image is fine — it is just for a different machine.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">exec format error</span><span class="v">Wrong architecture. Check <code>docker inspect --format '{{.Architecture}}'</code> against <code>uname -m</code>. <code>amd64</code> = <code>x86_64</code>, <code>arm64</code> = <code>aarch64</code> — the same thing under two naming schemes.</span></div>
  <div class="kv"><span class="k">no matching manifest for linux/arm64</span><span class="v">The opposite: the image index exists but has no build for your platform. Common with older or niche images that only publish amd64.</span></div>
  <div class="kv"><span class="k">The image runs but is bizarrely slow</span><span class="v">You are running under emulation without realising. A ten-second build takes four minutes. <code>docker run --rm alpine uname -m</code> versus your host tells you.</span></div>
  <div class="kv"><span class="k">It works locally, dies in CI</span><span class="v">Or the reverse. Apple Silicon developer, x86 CI runner, x86 server — three machines, two architectures, and only one of them tells you.</span></div>
</div>


<h3>The two faces of wrong-architecture on Docker 29 — reproduced for real</h3>
<p>The transcript above is the classic shape. On Docker 29 you will meet the problem in one of two forms, depending on <em>how</em> the image reached the server. Both were reproduced with the course's machines: an image built on the Mac (arm64) was sent to the Linux box (amd64, with no emulator installed).</p>
<p><strong>Form 1 — through a registry: refused before anything runs.</strong> Docker 29 on the containerd image store builds an <em>index</em> even for a one-platform build (the image plus an attestation). When the amd64 server pulls it, it looks for its own platform in the list and finds none:</p>
<pre><code class="language-bash"><span class="tok-comment"># Mac: docker build -t localhost:18030/dk03-app:latest . &amp;&amp; docker push …</span>
<span class="tok-comment"># Linux server:</span>
docker pull localhost:18030/dk03-app:latest</code></pre>
<div class="out">Error response from daemon: no matching manifest for linux/amd64/v3 in the manifest list entries: no match for platform in manifest: not found</div>
<p>This is the <em>kind</em> failure: it happens at pull time, nothing starts, and the message names the platform. <code>linux/amd64/v3</code> is the server describing itself precisely — an amd64 CPU with the "v3" feature level (AVX2 and friends).</p>
<p><strong>Form 2 — around the registry: it starts, then dies.</strong> If the image travels as a file — <code>docker save | ssh server docker load</code>, the no-registry trick from Lesson 1.4 — there is no index to consult, so Docker loads the arm64 image and tries to run it:</p>
<pre><code class="language-bash">docker save dk03-app:moi | ssh linux-nha 'docker load &amp;&amp; docker run --rm dk03-app:moi; echo "exit=$?"'</code></pre>
<div class="out">Loaded image: dk03-app:moi
WARNING: The requested image's platform (linux/arm64) does not match the detected host platform (linux/amd64/v3) and no specific platform was requested
exec /bin/cat: exec format error
exit=255</div>
<p>Docker 29 prints a <code>WARNING</code> first (the older transcript above predates it), then the kernel refuses the binary. The exit code is <strong>255</strong> — not 126 or 127, because the process never started at all. The same happens if you force the platform on pull (<code>docker pull --platform linux/arm64 …</code>) or pin a platform-specific digest (Lesson 3.2). In a Compose deploy the symptom is a container in a restart loop whose logs contain exactly one line: <code>exec … exec format error</code>.</p>
<table>
<tr><th>What you see</th><th>When</th><th>Meaning</th></tr>
<tr><td><code>no matching manifest for linux/amd64…</code></td><td>at <code>pull</code></td><td>the index has no entry for this CPU — rebuild for it</td></tr>
<tr><td><code>WARNING: The requested image's platform (linux/arm64) does not match…</code></td><td>at <code>run</code></td><td>you are about to run a foreign image; next line decides</td></tr>
<tr><td><code>exec … exec format error</code>, exit 255</td><td>at <code>run</code></td><td>no emulator for that architecture on this host</td></tr>
<tr><td>runs, but everything is 3–10× slower</td><td>at <code>run</code></td><td>an emulator IS installed (Docker Desktop, <code>binfmt</code>) — you are emulating</td></tr>
</table>
<div class="pitfall co-tieu-de"><strong>"exec format error" is not ALWAYS the architecture.</strong> The kernel says the same thing for any file it cannot execute — including a shell script that has no <code>#!/bin/sh</code> first line. On the course Mac, an arm64 image on an arm64 machine, entrypoint <code>["/run.sh"]</code> where <code>run.sh</code> contained only <code>echo xin chao</code>:
<pre><code class="language-bash">docker run --rm dk03-noshebang:1; echo "exit=$?"</code></pre>
<div class="out">exec /run.sh: exec format error
exit=255</div>
So read the path in the message. <code>exec /usr/local/bin/node</code> or <code>exec /bin/sh</code> (a real binary) ⇒ architecture. <code>exec /run.sh</code> or <code>exec /docker-entrypoint.sh</code> (your script) ⇒ check its first line: a missing <code>#!</code>, or a Windows line ending turning it into <code>#!/bin/sh\\r</code> (then the message is <code>exec /run.sh: no such file or directory</code> — measured the same way). The <code>WARNING … does not match the detected host platform</code> line appears only in the architecture case.</div>
<h3>Reading an index</h3>
${slide('dk-03', 20, 'Mỗi máy tự chọn mục khớp CPU của nó trong chỉ mục')}
<pre><code>docker buildx imagetools inspect --raw node:22-alpine \\
  | jq -r '.manifests[] | "\\(.platform.os)/\\(.platform.architecture)\\(.platform.variant // "") \\(.digest[0:19])"'</code></pre>
<div class="out">linux/amd64 sha256:b64da1de5a51
unknown/unknown sha256:392560769c9e
linux/armv6 sha256:16b35241821e
unknown/unknown sha256:22ceae60cd7b
linux/armv7 sha256:2187e2784540
unknown/unknown sha256:dd4e614ebe01
linux/arm64v8 sha256:451d2ebc48dd
unknown/unknown sha256:87d9ec43cce8
linux/s390x sha256:a13e916dbc76
unknown/unknown sha256:dce75336ebc8</div>
<p class="note-ct">Real output (course Mac, 23/09/2026). The Engine 27 version listed invented digests and a <code>ppc64le</code> build; today <code>node:22-alpine</code> has five platforms, each followed by its <em>own</em> attestation entry. The <code>armv6</code>/<code>arm64v8</code> spelling (no slash) comes from this <code>jq</code> filter gluing the variant onto the architecture; <code>imagetools inspect</code> prints <code>linux/arm64/v8</code>.</p>
<p>Five real platforms plus an <code>unknown/unknown</code> entry per platform, which is the attestation manifest — build provenance and an SBOM, attached to the index by modern BuildKit. It is not a platform and is skipped when Docker chooses which image to pull.</p>
<pre><code><span class="tok-comment"># What does THIS machine resolve that tag to?</span>
docker pull -q node:22-alpine &gt;/dev/null
docker image inspect node:22-alpine --format '{{.Os}}/{{.Architecture}}'
docker version --format '{{.Server.Arch}}'</code></pre>
<div class="out">linux/amd64
amd64</div>
<p class="note-ct">That output is from an amd64 server. The same two commands on the course Mac print <code>linux/arm64</code> and <code>arm64</code>, and on the Linux machine <code>docker version --format '{{.Server.Arch}}'</code> prints <code>amd64</code> while <code>uname -m</code> prints <code>x86_64</code> — the same CPU under the two naming schemes.</p>

<h3>--platform, and what it really costs</h3>
${slide('dk-03', 21, 'Rosetta gần như miễn phí, QEMU chậm khoảng 3 lần')}
<pre><code><span class="tok-comment"># Ask for a specific platform explicitly</span>
docker pull --platform linux/arm64 alpine:3.20
docker run --rm --platform linux/arm64 alpine uname -m
docker run --rm alpine uname -m</code></pre>
<div class="out">aarch64
x86_64</div>
<p>An ARM binary just ran on an x86 machine. That works because Docker Desktop, and Linux hosts with <code>binfmt_misc</code> configured, transparently route foreign binaries through QEMU emulation. It is genuinely useful — and it is <strong>slow</strong>, in a way that surprises people:</p>
<pre><code><span class="tok-comment"># Install the emulators on a plain Linux host (one time)</span>
docker run --privileged --rm tonistiigi/binfmt --install all
ls /proc/sys/fs/binfmt_misc/ | head -5

<span class="tok-comment"># Measure the cost on the same work</span>
time docker run --rm alpine sh -c 'apk add --no-cache python3 &gt;/dev/null'
time docker run --rm --platform linux/arm64 alpine sh -c 'apk add --no-cache python3 &gt;/dev/null'</code></pre>
<div class="out">qemu-aarch64
qemu-arm
qemu-ppc64le
qemu-riscv64
qemu-s390x
real	0m4.118s
real	0m41.702s</div>
<div class="callout warn"><strong>Ten times slower, on a trivial package install.</strong> On a real build — compiling native modules, running a test suite — emulation is routinely 5–20× slower, and some workloads simply fail: JIT compilers, code that probes CPU features, and anything with a build-time timeout. Emulation is for <em>producing</em> an image you cannot build natively, and for a quick check. It is not a way to develop.</div>


<h3>Measured on a Mac: Rosetta is nearly free, QEMU is not</h3>
<p>The 10× above was measured with QEMU on an x86 Linux host. On Apple silicon the picture is different, because Docker Desktop has two emulators. You can see them inside Docker Desktop's Linux VM (a privileged helper container, read-only):</p>
<pre><code class="language-bash">docker run --rm --privileged --pid=host alpine:3.20 nsenter -t 1 -m -- ls /proc/sys/fs/binfmt_misc/</code></pre>
<div class="out">arm
i386
mips64
mips64le
ppc64le
register
riscv64
rosetta
rosetta-wrapper
s390x</div>
<p><code>rosetta</code> handles amd64 binaries — Apple's translator, the same one that runs Intel Mac apps. Everything else (<code>riscv64</code>, <code>s390x</code>, <code>ppc64le</code>…) goes to QEMU. The same CPU-bound job — hashing 500 MB of zeros — on the course Mac M1, each run twice after the image was already local:</p>
<pre><code class="language-bash">for p in linux/arm64 linux/amd64 linux/riscv64; do
  /usr/bin/time -p docker run --rm --platform $p alpine:3.20 \\
    sh -c 'dd if=/dev/zero bs=1M count=500 2&gt;/dev/null | sha256sum &gt;/dev/null; uname -m'
done</code></pre>
<table>
<tr><th>Platform</th><th>Runs via</th><th>real (s)</th><th>vs native</th></tr>
<tr><td><code>linux/arm64</code></td><td>native</td><td>3.38</td><td>1×</td></tr>
<tr><td><code>linux/amd64</code></td><td>Rosetta</td><td>3.95</td><td>≈1.2×</td></tr>
<tr><td><code>linux/riscv64</code></td><td>QEMU</td><td>8.85 · 9.87</td><td>≈2.6–2.9×</td></tr>
</table>
<p>(An empty <code>docker run --rm alpine:3.20 true</code> takes 0.25 s, so the container overhead is small here.) Two practical lessons. On a Mac, running an amd64-only image — an old tool, a vendor image — is cheap enough for daily development. But emulation cost depends heavily on the workload: a sequential hash is Rosetta's best case, while compiling native modules, JIT-heavy runtimes and anything that probes CPU features can be far slower or break. And the plain Linux box has <em>no</em> emulator at all — that is why Form 2 above ended in <code>exec format error</code> instead of running slowly.</p>
<h3>Building for both</h3>
${slide('dk-03', 22, 'Docker 29: một lệnh dựng hai kiến trúc, --load thẳng về máy')}
<pre><code>docker buildx create --name multi --driver docker-container --use
docker buildx inspect --bootstrap | head -6</code></pre>
<div class="out">Name:          multi
Driver:        docker-container
Nodes:
Name:      multi0
Status:    running
Platforms: linux/amd64, linux/amd64/v2, linux/arm64, linux/arm/v7, linux/riscv64</div>
<pre><code><span class="tok-comment"># Build both architectures and push the index in one command</span>
docker buildx build --platform linux/amd64,linux/arm64 \\
  -t ghcr.io/cuonghoang1103/app:1.0 --push .

<span class="tok-comment"># Verify what landed</span>
docker buildx imagetools inspect ghcr.io/cuonghoang1103/app:1.0 | grep Platform</code></pre>
<div class="out">    Platform:    linux/amd64
    Platform:    linux/arm64</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--push was required for multi-platform (classic store only)</span><span class="v">On the classic <code>overlay2</code> image store the local store cannot hold an index of several platforms, so <code>--load</code> fails with <code>docker exporter does not currently support exporting manifest lists</code> and multi-arch builds must go straight to a registry. <strong>This no longer applies</strong> to Docker Desktop or to Docker Engine 29+ fresh installs, which use the containerd image store: there <code>--load</code> keeps the whole index locally (next section).</span></div>
  <div class="kv"><span class="k">The docker-container driver</span><span class="v">On the classic image store the default <code>docker</code> driver cannot do multi-platform (with the containerd store it can). <code>docker buildx create --driver docker-container</code> gives you a builder that can, running BuildKit in its own container with its own cache.</span></div>
  <div class="kv"><span class="k">Emulated builds are slow</span><span class="v">Building arm64 under QEMU on an x86 runner works and can take twenty minutes. Acceptable for a nightly release build; painful on every commit.</span></div>
  <div class="kv"><span class="k">Native runners are the real answer</span><span class="v">GitHub now offers ARM runners; building each platform on matching hardware in parallel and merging the manifests afterwards is both faster and more reliable than emulation.</span></div>
  <div class="kv"><span class="k">Or cross-compile</span><span class="v">Go, Rust and .NET cross-compile natively. Use the <code>&#36;{TARGETPLATFORM}</code> and <code>&#36;{BUILDPLATFORM}</code> build arguments BuildKit provides, compile on the fast native host, and copy the right binary into a tiny final stage (Chapter 6).</span></div>
</div>
<pre><code><span class="tok-comment"># The cross-compilation shape, for reference — Chapter 6 builds it out</span>
FROM --platform=&#36;{BUILDPLATFORM} golang:1.23 AS build
ARG TARGETOS TARGETARCH
RUN GOOS=&#36;{TARGETOS} GOARCH=&#36;{TARGETARCH} go build -o /app ./cmd/server

FROM alpine:3.20
COPY --from=build /app /app</code></pre>
<p>Here is the smallest Dockerfile that shows what those build arguments contain — the one used for <code>dk03-multi:1</code> above:</p>
<pre><code class="language-dockerfile">FROM --platform=$BUILDPLATFORM alpine:3.20 AS build
ARG BUILDPLATFORM TARGETPLATFORM
RUN echo "dung tren $BUILDPLATFORM cho $TARGETPLATFORM" &gt; /info.txt
FROM alpine:3.20
LABEL dkhoc=03
COPY --from=build /info.txt /info.txt
CMD ["sh", "-c", "cat /info.txt; uname -m"]</code></pre>
<table>
<tr><th>Line</th><th>What it does in a two-platform build</th></tr>
<tr><td><code>FROM --platform=$BUILDPLATFORM … AS build</code></td><td>this stage always uses the <em>builder's</em> architecture (arm64 on the Mac) — it runs natively, fast, even when building for amd64</td></tr>
<tr><td><code>ARG BUILDPLATFORM TARGETPLATFORM</code></td><td>BuildKit fills these in automatically; you only have to declare them to use them</td></tr>
<tr><td><code>RUN echo …</code></td><td>runs twice (once per target), both times natively; a real project would run <code>GOOS=… GOARCH=… go build</code> here</td></tr>
<tr><td><code>FROM alpine:3.20</code> (no <code>--platform</code>)</td><td>the final stage takes the <em>target</em> architecture: amd64 alpine for the amd64 image</td></tr>
<tr><td><code>COPY --from=build</code></td><td>carries the result across; for a compiled binary it must be the one built for that target</td></tr>
</table>
<p>The output proves it: both images say <code>dung tren linux/arm64</code> — built on arm64 — but <code>cho linux/amd64</code> for the image the server ran. Node.js projects have no binary to cross-compile, so for them the pattern is "install dependencies in the target stage", and the only emulated step is <code>npm ci</code> of native modules — which is exactly where emulated builds get slow.</p>



<h3>Docker 29: multi-platform with the default builder, and --load works</h3>
<p>Docker's documentation now says it directly: <em>"Docker Desktop and Docker Engine 29.0+ use the containerd image store by default, which supports multi-platform images out of the box."</em> Check which store you have first — a machine upgraded from an older Engine may still be on overlay2:</p>
<pre><code class="language-bash">docker info --format '{{.DriverStatus}}'</code></pre>
<div class="out">[[driver-type io.containerd.snapshotter.v1]]</div>
<p>That is the course Mac. With it, no special builder and no registry are needed — the Dockerfile from the next section, built on the default <code>desktop-linux</code> builder:</p>
<pre><code class="language-bash">docker buildx build --platform linux/amd64,linux/arm64 -t dk03-multi:1 --load .
docker run --rm dk03-multi:1
docker run --rm --platform linux/amd64 dk03-multi:1
docker image ls --tree dk03-multi:1</code></pre>
<div class="out">#11 exporting manifest list sha256:e2ff2c8a77d7b03d9a01c2980afd7b5a1a5920c6024f259e5000a8e34e0b581f done
#11 naming to docker.io/library/dk03-multi:1 done
#11 unpacking to docker.io/library/dk03-multi:1 0.0s done
dung tren linux/arm64 cho linux/arm64
aarch64
dung tren linux/arm64 cho linux/amd64
x86_64
IMAGE                ID             DISK USAGE   CONTENT SIZE   EXTRA
dk03-multi:1         e2ff2c8a77d7       25.7MB         7.73MB
├─ linux/amd64       060304a7b1b1       12.1MB         3.63MB
└─ linux/arm64       5d668cf2c045       13.6MB         4.09MB</div>
<p>One local tag, two real images under it — <code>docker image ls --tree</code> is the Docker 29 way to see an index on your own machine. Push it and the registry receives the whole index, attestations included:</p>
<pre><code class="language-bash">docker tag dk03-multi:1 localhost:18030/dk03-multi:1 &amp;&amp; docker push -q localhost:18030/dk03-multi:1
docker buildx imagetools inspect localhost:18030/dk03-multi:1 | grep -E 'Digest|Platform'</code></pre>
<div class="out">Digest:    sha256:e2ff2c8a77d7b03d9a01c2980afd7b5a1a5920c6024f259e5000a8e34e0b581f
  Platform:    linux/amd64
  Platform:    linux/arm64
  Platform:    unknown/unknown
  Platform:    unknown/unknown</div>
<p>And the Linux server, pulling the same tag, got its own entry and ran natively: <code>dung tren linux/arm64 cho linux/amd64</code> / <code>x86_64</code>. The build happened on the Mac, the <code>RUN</code> step ran natively on arm64, and yet the amd64 server received a correct amd64 image — the next section explains how.</p>
<h3>Pinning platform where it matters</h3>
${slide('dk-03', 23, 'Biên dịch chéo: dựng trên máy mình, cho máy đích')}
<pre><code><span class="tok-comment"># In a Dockerfile, when a stage must run on the BUILD machine</span>
FROM --platform=\$BUILDPLATFORM node:22-alpine AS build

<span class="tok-comment"># In compose.yaml, when a service has no image for your machine</span>
services:
  legacy:
    image: someorg/oldthing:2.1
    platform: linux/amd64</code></pre>
<div class="callout ok"><strong><code>platform: linux/amd64</code> in Compose is the pragmatic fix for one stubborn service.</strong> An old image with no ARM build will then run under emulation on an Apple Silicon laptop — slowly, but it runs, and the rest of your stack stays native. Put a comment next to it saying why, because a whole Compose file pinned to <code>linux/amd64</code> is how a team ends up emulating everything and wondering why their machines are slow.</div>
<pre><code>docker buildx rm multi &gt;/dev/null 2&gt;&amp;1; docker rmi alpine:3.20 &gt;/dev/null 2&gt;&amp;1</code></pre>

<h3>Why exec format error happens</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">An image is built for one CPU architecture</span><span class="lz-d"><code>linux/amd64</code> or <code>linux/arm64</code>. The binaries inside are machine code for that instruction set and nothing else.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">A tag can point at an index, not an image</span><span class="lz-d">A multi-arch tag is a manifest list: the daemon picks the entry matching its own platform. That is why <code>node:22</code> works everywhere.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Build on Apple silicon, run on an x86 VPS</span><span class="lz-d">Your local build produced arm64 only, the tag now points at an arm64 image, and the server cannot execute a single instruction in it.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The error names the format, not the cause</span><span class="lz-d"><code>exec format error</code> — the kernel is telling you the ELF header is for another machine. Nothing mentions architecture, which is why it reads as corruption.</span></div>
</div>

<h3>Try it step by step: diagnose an image in 30 seconds</h3>
<ol>
<li>What is the machine? <code>uname -m</code> (and on Docker: <code>docker version --format '{{.Server.Arch}}'</code>).</li>
<li>What is the image you have locally? <code>docker image inspect IMAGE --format '{{.Os}}/{{.Architecture}}'</code>.</li>
<li>What does the registry offer under that tag? <code>docker buildx imagetools inspect IMAGE | grep Platform</code>.</li>
<li>Is there an emulator on this host? <code>ls /proc/sys/fs/binfmt_misc/</code> on Linux (only <code>register</code> and <code>status</code> ⇒ none).</li>
<li>Decide: rebuild with <code>--platform linux/amd64,linux/arm64</code>, pin the <em>index</em> digest, or — for one stubborn third-party service — <code>platform: linux/amd64</code> in Compose.</li>
</ol>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> you build the group's API on your M1 Mac and a teammate on a Windows laptop (amd64, WSL2) says <code>docker compose up</code> fails with <code>no matching manifest for linux/amd64</code>. Make one image that works on both machines, and prove it without borrowing their laptop.</p><ol>
<li>In <code>~/thu-docker/multi</code>, write the seven-line cross-build Dockerfile from this lesson.</li>
<li>Build it once for your machine only (<code>docker build -t thu-multi:single .</code>) and inspect: <code>docker image ls --tree thu-multi:single</code> — how many platforms?</li>
<li>Build it for both: <code>docker buildx build --platform linux/amd64,linux/arm64 -t thu-multi:1 --load .</code>, then look at <code>--tree</code> again.</li>
<li>Run both variants with <code>--platform</code> and read the two lines each prints.</li>
<li>Clean up: <code>docker rmi thu-multi:single thu-multi:1</code>.</li></ol>
<p><strong>Done when:</strong> <code>--tree</code> shows one platform for the first build and two for the second, the amd64 run prints <code>x86_64</code> and says it was built on your Mac's platform, and you can explain to your teammate which line of the Dockerfile made that possible.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Architecture (arch)</span><span class="v">The CPU instruction set: <code>amd64</code> = <code>x86_64</code>, <code>arm64</code> = <code>aarch64</code>.</span></div>
  <div class="kv"><span class="k">Platform</span><span class="v"><code>os/arch[/variant]</code>, e.g. <code>linux/arm64/v8</code> — the key an index is looked up by.</span></div>
  <div class="kv"><span class="k">exec format error</span><span class="v">The kernel's refusal to run a binary built for another CPU; exit 255 in Docker 29.</span></div>
  <div class="kv"><span class="k">Emulation (QEMU / Rosetta)</span><span class="v">Running foreign binaries by translating them; works, costs from ~1.2× (Rosetta) to many times (QEMU).</span></div>
  <div class="kv"><span class="k">binfmt_misc</span><span class="v">The Linux feature that hands foreign binaries to an emulator automatically.</span></div>
  <div class="kv"><span class="k">containerd image store</span><span class="v">Docker 29 / Desktop's image store; holds whole indexes, so <code>--load</code> works for multi-platform.</span></div>
  <div class="kv"><span class="k">BUILDPLATFORM / TARGETPLATFORM</span><span class="v">Build arguments: the machine building vs the machine that will run the image.</span></div>
  <div class="kv"><span class="k">Cross-compilation</span><span class="v">Producing a binary for another architecture natively on the builder — fast and reliable.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>An image contains machine code for one CPU; a multi-arch tag is an index and each host picks its own entry.</li>
<li>Via a registry, a missing platform fails at pull (<code>no matching manifest</code>); via save/load or a platform digest, it fails at run (<code>exec format error</code>, exit 255).</li>
<li>Diagnose with <code>uname -m</code>, <code>.Architecture</code> and <code>imagetools inspect</code> — three commands.</li>
<li>On a Mac, amd64 runs through Rosetta at about 1.2×; other architectures go through QEMU at several times.</li>
<li>Docker 29's containerd store builds and <code>--load</code>s multi-platform images with the default builder.</li>
<li>Use <code>FROM --platform=$BUILDPLATFORM</code> to do the heavy work natively and only the final stage per target.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/building/multi-platform/" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">Multi-platform builds</span><span class="lc-sub">The three strategies — emulation, native nodes, cross-compilation — with their trade-offs, plus the <code>TARGETPLATFORM</code> build-arg table you will want when cross-compiling.</span></span>
</a>
<a class="link-card" href="https://github.com/tonistiigi/binfmt" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">tonistiigi/binfmt</span><span class="lc-sub">The one-command way to register QEMU emulators on a Linux host. The README explains what <code>binfmt_misc</code> is doing, which demystifies how a foreign binary runs at all.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/builders/drivers/" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Buildx drivers</span><span class="lc-sub">docker, docker-container, kubernetes and remote — what each can do, and specifically which ones support multi-platform output and external cache.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: cross the architectures</span><span class="lc-sub">Graded exercises: diagnose an <code>exec format error</code> from two commands, list the platforms in a published index, measure the emulation penalty yourself, and explain why <code>--load</code> fails on a multi-platform build.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> a developer on an Apple Silicon Mac running <code>docker build -t app:1.0 . &amp;&amp; docker push app:1.0</code>. The build defaults to the host platform, so an arm64-only image goes to the registry, and the x86 production server fails with <code>exec format error</code> — after a successful build, a successful push and a successful deploy. Three green steps and a dead service. The fixes, in order of preference: build in CI on an x86 runner; or always build with <code>docker buildx build --platform linux/amd64,linux/arm64 --push</code>; or at minimum add a check to your deploy script — <code>docker buildx imagetools inspect "\$IMAGE" | grep -q 'linux/amd64'</code> — that refuses to deploy an image the server cannot run.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>exec format error</code> on a real binary means wrong architecture (on your own script, check its <code>#!</code> line first — see the pitfall box above): compare <code>docker inspect --format '{{.Architecture}}'</code> with <code>uname -m</code> and the diagnosis is done. One tag can be an index of several per-platform images, and <code>docker buildx imagetools inspect</code> is how you see what is really in there. And emulation works but costs 5–20× — build natively or cross-compile for anything you do more than occasionally.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Ảnh đa kiến trúc và lỗi exec format error</h2>
<p class="lead">Một container dùng chung nhân của máy chủ và chạy mã máy NATIVE (Bài 1.1), nên một cái ảnh gắn liền với một kiến trúc. Từ khi Apple chuyển sang ARM còn phần lớn máy chủ vẫn ở x86, chuyện này thôi là mối bận tâm ngách và trở thành câu chuyện "nó dựng ngon lành mà máy chủ từ chối khởi chạy" phổ biến nhất.</p>

<h3>Cú hỏng, đầy đủ</h3>
${slide('dk-03', 19, 'Ảnh sai kiến trúc chết theo hai kiểu khác nhau')}
<div class="out">$ docker run --rm myapp:1.0
exec /usr/local/bin/node: exec format error

$ docker inspect myapp:1.0 --format '{{.Os}}/{{.Architecture}}'
linux/arm64

$ uname -m
x86_64</div>
<p>Nhân được đưa một chương trình ARM64 trên một cái máy x86-64 và nó từ chối. Thông báo thì cộc lốc và đúng: định dạng của tệp thực thi không phải thứ CPU này chạy được. Không có gì hỏng, cái ảnh vẫn ổn — nó chỉ dành cho một cái máy KHÁC.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">exec format error</span><span class="v">Sai kiến trúc. Hãy đối chiếu <code>docker inspect --format '{{.Architecture}}'</code> với <code>uname -m</code>. <code>amd64</code> = <code>x86_64</code>, <code>arm64</code> = <code>aarch64</code> — cùng một thứ dưới hai hệ đặt tên.</span></div>
  <div class="kv"><span class="k">no matching manifest for linux/arm64</span><span class="v">Ngược lại: chỉ mục ảnh có tồn tại nhưng không có bản dựng nào cho nền tảng của bạn. Hay gặp với những ảnh cũ hoặc ngách chỉ công bố bản amd64.</span></div>
  <div class="kv"><span class="k">Ảnh chạy được nhưng chậm một cách kỳ quái</span><span class="v">Bạn đang chạy dưới MÔ PHỎNG mà không nhận ra. Một lượt dựng mười giây ngốn bốn phút. So <code>docker run --rm alpine uname -m</code> với máy chủ của bạn là biết.</span></div>
  <div class="kv"><span class="k">Chạy được ở máy, chết trong CI</span><span class="v">Hoặc ngược lại. Lập trình viên dùng Apple Silicon, máy chạy CI x86, máy chủ x86 — ba cái máy, hai kiến trúc, và chỉ một trong số đó nói cho bạn biết.</span></div>
</div>


<h3>Hai gương mặt của lỗi sai kiến trúc trên Docker 29 — dựng lại thật</h3>
<p>Bản ghi ở trên là hình dạng kinh điển. Trên Docker 29 bạn sẽ gặp vấn đề này ở một trong hai dạng, tuỳ ảnh tới máy chủ <em>BẰNG CÁCH NÀO</em>. Khoá đã dựng lại cả hai với hai máy: một ảnh dựng trên máy Mac (arm64) được gửi sang máy Linux (amd64, không cài bộ mô phỏng nào).</p>
<p><strong>Dạng 1 — đi qua registry: bị từ chối trước khi có gì chạy.</strong> Docker 29 với kho ảnh containerd dựng ra một <em>chỉ mục</em> kể cả khi chỉ dựng một nền tảng (ảnh + một chứng thực). Khi máy chủ amd64 kéo nó về, nó tìm nền tảng của mình trong danh sách và không thấy:</p>
<pre><code class="language-bash"><span class="tok-comment"># Mac: docker build -t localhost:18030/dk03-app:latest . &amp;&amp; docker push …</span>
<span class="tok-comment"># Máy chủ Linux:</span>
docker pull localhost:18030/dk03-app:latest</code></pre>
<div class="out">Error response from daemon: no matching manifest for linux/amd64/v3 in the manifest list entries: no match for platform in manifest: not found</div>
<p>Đây là kiểu hỏng <em>TỬ TẾ</em>: nó xảy ra lúc kéo, chưa có gì khởi động, và thông báo gọi đúng tên nền tảng. <code>linux/amd64/v3</code> là máy chủ tự mô tả chính xác mình — một CPU amd64 ở mức tính năng "v3" (AVX2 và các tập lệnh đi kèm).</p>
<p><strong>Dạng 2 — đi vòng qua registry: khởi động được, rồi chết.</strong> Nếu ảnh đi dưới dạng file — <code>docker save | ssh máy-chủ docker load</code>, mẹo không cần registry ở Bài 1.4 — thì không có chỉ mục nào để tra, nên Docker nạp ảnh arm64 và cố chạy nó:</p>
<pre><code class="language-bash">docker save dk03-app:moi | ssh linux-nha 'docker load &amp;&amp; docker run --rm dk03-app:moi; echo "exit=$?"'</code></pre>
<div class="out">Loaded image: dk03-app:moi
WARNING: The requested image's platform (linux/arm64) does not match the detected host platform (linux/amd64/v3) and no specific platform was requested
exec /bin/cat: exec format error
exit=255</div>
<p>Docker 29 in ra một <code>WARNING</code> trước (bản ghi cũ phía trên có từ trước khi có nó), rồi nhân từ chối chương trình. Mã thoát là <strong>255</strong> — không phải 126 hay 127, vì tiến trình còn chưa khởi động được. Chuyện y hệt xảy ra nếu bạn ép nền tảng khi kéo (<code>docker pull --platform linux/arm64 …</code>) hoặc ghim một digest riêng của một nền tảng (Bài 3.2). Trong một lần deploy bằng Compose, triệu chứng là một container quay vòng khởi động lại mà log chỉ có đúng một dòng: <code>exec … exec format error</code>.</p>
<table>
<tr><th>Bạn thấy</th><th>Lúc nào</th><th>Nghĩa là</th></tr>
<tr><td><code>no matching manifest for linux/amd64…</code></td><td>lúc <code>pull</code></td><td>chỉ mục không có mục cho CPU này — hãy dựng cho nó</td></tr>
<tr><td><code>WARNING: The requested image's platform (linux/arm64) does not match…</code></td><td>lúc <code>run</code></td><td>bạn sắp chạy một ảnh "ngoại"; dòng tiếp theo quyết định</td></tr>
<tr><td><code>exec … exec format error</code>, exit 255</td><td>lúc <code>run</code></td><td>máy chủ này không có bộ mô phỏng cho kiến trúc đó</td></tr>
<tr><td>chạy được, nhưng mọi thứ chậm 3–10 lần</td><td>lúc <code>run</code></td><td>CÓ bộ mô phỏng (Docker Desktop, <code>binfmt</code>) — bạn đang mô phỏng</td></tr>
</table>
<div class="pitfall co-tieu-de"><strong>"exec format error" KHÔNG phải lúc nào cũng là do kiến trúc.</strong> Nhân báo đúng câu đó cho bất kỳ file nào nó không thực thi được — kể cả một script shell thiếu dòng đầu <code>#!/bin/sh</code>. Trên máy Mac của khoá, một ảnh arm64 trên máy arm64, entrypoint <code>["/run.sh"]</code> mà <code>run.sh</code> chỉ chứa <code>echo xin chao</code>:
<pre><code class="language-bash">docker run --rm dk03-noshebang:1; echo "exit=$?"</code></pre>
<div class="out">exec /run.sh: exec format error
exit=255</div>
Nên hãy đọc đường dẫn trong thông báo. <code>exec /usr/local/bin/node</code> hay <code>exec /bin/sh</code> (một chương trình thật) ⇒ kiến trúc. <code>exec /run.sh</code> hay <code>exec /docker-entrypoint.sh</code> (script của bạn) ⇒ kiểm dòng đầu của nó: thiếu <code>#!</code>, hoặc kiểu xuống dòng Windows biến nó thành <code>#!/bin/sh\\r</code> (khi đó thông báo là <code>exec /run.sh: no such file or directory</code> — đo cùng cách). Dòng <code>WARNING … does not match the detected host platform</code> chỉ xuất hiện trong trường hợp kiến trúc.</div>
<h3>Đọc một cái chỉ mục</h3>
${slide('dk-03', 20, 'Mỗi máy tự chọn mục khớp CPU của nó trong chỉ mục')}
<pre><code>docker buildx imagetools inspect --raw node:22-alpine \\
  | jq -r '.manifests[] | "\\(.platform.os)/\\(.platform.architecture)\\(.platform.variant // "") \\(.digest[0:19])"'</code></pre>
<div class="out">linux/amd64 sha256:b64da1de5a51
unknown/unknown sha256:392560769c9e
linux/armv6 sha256:16b35241821e
unknown/unknown sha256:22ceae60cd7b
linux/armv7 sha256:2187e2784540
unknown/unknown sha256:dd4e614ebe01
linux/arm64v8 sha256:451d2ebc48dd
unknown/unknown sha256:87d9ec43cce8
linux/s390x sha256:a13e916dbc76
unknown/unknown sha256:dce75336ebc8</div>
<p class="note-ct">Output thật (máy Mac của khoá, 23/09/2026). Bản viết theo Engine 27 liệt kê những digest bịa và một bản <code>ppc64le</code>; hôm nay <code>node:22-alpine</code> có năm nền tảng, mỗi cái đi kèm một mục chứng thực <em>RIÊNG</em>. Cách viết <code>armv6</code>/<code>arm64v8</code> (không có dấu gạch chéo) là do bộ lọc <code>jq</code> này dán phần variant vào ngay sau kiến trúc; <code>imagetools inspect</code> thì in <code>linux/arm64/v8</code>.</p>
<p>Năm nền tảng thật, mỗi nền tảng thêm một mục <code>unknown/unknown</code>, và đó là manifest chứng thực — xuất xứ bản dựng và một SBOM, do BuildKit hiện đại đính kèm vào chỉ mục. Nó không phải một nền tảng và bị bỏ qua khi Docker chọn xem phải kéo ảnh nào.</p>
<pre><code><span class="tok-comment"># CÁI MÁY NÀY phân giải cái tag đó ra thành gì?</span>
docker pull -q node:22-alpine &gt;/dev/null
docker image inspect node:22-alpine --format '{{.Os}}/{{.Architecture}}'
docker version --format '{{.Server.Arch}}'</code></pre>
<div class="out">linux/amd64
amd64</div>
<p class="note-ct">Output đó là của một máy chủ amd64. Cùng hai lệnh trên máy Mac của khoá in ra <code>linux/arm64</code> và <code>arm64</code>, còn trên máy Linux thì <code>docker version --format '{{.Server.Arch}}'</code> in <code>amd64</code> trong khi <code>uname -m</code> in <code>x86_64</code> — cùng một CPU dưới hai hệ đặt tên.</p>

<h3>--platform, và cái giá thật của nó</h3>
${slide('dk-03', 21, 'Rosetta gần như miễn phí, QEMU chậm khoảng 3 lần')}
<pre><code><span class="tok-comment"># Yêu cầu một nền tảng cụ thể một cách tường minh</span>
docker pull --platform linux/arm64 alpine:3.20
docker run --rm --platform linux/arm64 alpine uname -m
docker run --rm alpine uname -m</code></pre>
<div class="out">aarch64
x86_64</div>
<p>Một chương trình ARM vừa chạy trên một cái máy x86. Chuyện đó được vì Docker Desktop, và các máy chủ Linux có cấu hình <code>binfmt_misc</code>, âm thầm định tuyến những chương trình ngoại lai qua mô phỏng QEMU. Nó thật sự hữu ích — và nó <strong>CHẬM</strong>, chậm theo cách làm người ta bất ngờ:</p>
<pre><code><span class="tok-comment"># Cài các bộ mô phỏng trên một máy chủ Linux thuần (làm một lần)</span>
docker run --privileged --rm tonistiigi/binfmt --install all
ls /proc/sys/fs/binfmt_misc/ | head -5

<span class="tok-comment"># Đo cái giá trên cùng một khối lượng công việc</span>
time docker run --rm alpine sh -c 'apk add --no-cache python3 &gt;/dev/null'
time docker run --rm --platform linux/arm64 alpine sh -c 'apk add --no-cache python3 &gt;/dev/null'</code></pre>
<div class="out">qemu-aarch64
qemu-arm
qemu-ppc64le
qemu-riscv64
qemu-s390x
real	0m4.118s
real	0m41.702s</div>
<div class="callout warn"><strong>Chậm gấp MƯỜI lần, chỉ với một lượt cài gói tầm thường.</strong> Trên một lượt dựng thật — biên dịch mô-đun native, chạy bộ test — mô phỏng thường chậm gấp 5–20 lần, và có những khối lượng công việc đơn giản là HỎNG: trình biên dịch JIT, mã dò tính năng CPU, và mọi thứ có giới hạn thời gian lúc dựng. Mô phỏng là để <em>TẠO RA</em> một cái ảnh mà bạn không dựng native được, và để kiểm nhanh một cái. Nó KHÔNG phải một cách để phát triển phần mềm.</div>


<h3>Đo trên máy Mac: Rosetta gần như miễn phí, QEMU thì không</h3>
<p>Con số 10 lần ở trên được đo bằng QEMU trên một máy Linux x86. Trên chip Apple thì bức tranh khác, vì Docker Desktop có HAI bộ mô phỏng. Bạn nhìn thấy chúng bên trong máy ảo Linux của Docker Desktop (dùng một container phụ có đặc quyền, chỉ đọc):</p>
<pre><code class="language-bash">docker run --rm --privileged --pid=host alpine:3.20 nsenter -t 1 -m -- ls /proc/sys/fs/binfmt_misc/</code></pre>
<div class="out">arm
i386
mips64
mips64le
ppc64le
register
riscv64
rosetta
rosetta-wrapper
s390x</div>
<p><code>rosetta</code> xử lý chương trình amd64 — bộ dịch của Apple, chính cái đang chạy các ứng dụng Mac Intel cũ. Mọi thứ còn lại (<code>riscv64</code>, <code>s390x</code>, <code>ppc64le</code>…) đi qua QEMU. Cùng một việc thuần CPU — băm 500 MB số 0 — trên máy Mac M1 của khoá, mỗi cái chạy hai lần sau khi ảnh đã có sẵn trên máy:</p>
<pre><code class="language-bash">for p in linux/arm64 linux/amd64 linux/riscv64; do
  /usr/bin/time -p docker run --rm --platform $p alpine:3.20 \\
    sh -c 'dd if=/dev/zero bs=1M count=500 2&gt;/dev/null | sha256sum &gt;/dev/null; uname -m'
done</code></pre>
<table>
<tr><th>Nền tảng</th><th>Chạy qua</th><th>real (giây)</th><th>so với native</th></tr>
<tr><td><code>linux/arm64</code></td><td>native</td><td>3,38</td><td>1×</td></tr>
<tr><td><code>linux/amd64</code></td><td>Rosetta</td><td>3,95</td><td>≈1,2×</td></tr>
<tr><td><code>linux/riscv64</code></td><td>QEMU</td><td>8,85 · 9,87</td><td>≈2,6–2,9×</td></tr>
</table>
<p>(Một <code>docker run --rm alpine:3.20 true</code> rỗng mất 0,25 giây, nên chi phí của bản thân container ở đây là nhỏ.) Hai bài học thực tế. Trên Mac, chạy một ảnh chỉ có amd64 — một công cụ cũ, một ảnh của nhà cung cấp — đủ rẻ để dùng hằng ngày khi phát triển. Nhưng cái giá của mô phỏng phụ thuộc rất nhiều vào loại việc: băm tuần tự là trường hợp đẹp nhất của Rosetta, còn biên dịch mô-đun native, runtime dùng JIT nhiều, và bất cứ thứ gì dò tính năng CPU có thể chậm hơn nhiều hoặc hỏng hẳn. Và máy Linux thuần thì KHÔNG có bộ mô phỏng nào — đó là lý do Dạng 2 ở trên kết thúc bằng <code>exec format error</code> thay vì chạy chậm.</p>
<h3>Dựng cho cả hai</h3>
${slide('dk-03', 22, 'Docker 29: một lệnh dựng hai kiến trúc, --load thẳng về máy')}
<pre><code>docker buildx create --name multi --driver docker-container --use
docker buildx inspect --bootstrap | head -6</code></pre>
<div class="out">Name:          multi
Driver:        docker-container
Nodes:
Name:      multi0
Status:    running
Platforms: linux/amd64, linux/amd64/v2, linux/arm64, linux/arm/v7, linux/riscv64</div>
<pre><code><span class="tok-comment"># Dựng cả hai kiến trúc rồi đẩy chỉ mục lên, trong một câu lệnh</span>
docker buildx build --platform linux/amd64,linux/arm64 \\
  -t ghcr.io/cuonghoang1103/app:1.0 --push .

<span class="tok-comment"># Kiểm xem cái gì đã lên</span>
docker buildx imagetools inspect ghcr.io/cuonghoang1103/app:1.0 | grep Platform</code></pre>
<div class="out">    Platform:    linux/amd64
    Platform:    linux/arm64</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--push TỪNG bắt buộc với đa nền tảng (chỉ với kho cổ điển)</span><span class="v">Với kho ảnh <code>overlay2</code> cổ điển, kho cục bộ không chứa được một chỉ mục nhiều nền tảng, nên <code>--load</code> hỏng với <code>docker exporter does not currently support exporting manifest lists</code> và dựng đa kiến trúc phải đi thẳng lên registry. <strong>Điều này KHÔNG còn đúng</strong> với Docker Desktop và với Docker Engine 29+ cài mới, vốn dùng kho ảnh containerd: ở đó <code>--load</code> giữ cả chỉ mục trên máy (mục ngay sau).</span></div>
  <div class="kv"><span class="k">Trình điều khiển docker-container</span><span class="v">Với kho ảnh cổ điển, trình <code>docker</code> mặc định KHÔNG làm được đa nền tảng (với kho containerd thì làm được). <code>docker buildx create --driver docker-container</code> cho bạn một bộ dựng làm được, chạy BuildKit trong container riêng của nó với bộ đệm riêng.</span></div>
  <div class="kv"><span class="k">Dựng bằng mô phỏng thì chậm</span><span class="v">Dựng arm64 dưới QEMU trên một máy chạy CI x86 thì được và có thể mất hai mươi phút. Chấp nhận được với một bản dựng phát hành hằng đêm; đau đớn nếu chạy ở mọi commit.</span></div>
  <div class="kv"><span class="k">Máy chạy NATIVE mới là câu trả lời thật</span><span class="v">GitHub giờ có máy chạy ARM; dựng mỗi nền tảng trên đúng phần cứng của nó SONG SONG rồi ghép manifest lại vừa nhanh hơn vừa đáng tin hơn mô phỏng.</span></div>
  <div class="kv"><span class="k">Hoặc biên dịch chéo</span><span class="v">Go, Rust và .NET biên dịch chéo được một cách tự nhiên. Hãy dùng các tham số dựng <code>&#36;{TARGETPLATFORM}</code> và <code>&#36;{BUILDPLATFORM}</code> mà BuildKit cung cấp, biên dịch trên máy native nhanh, rồi chép đúng cái chương trình vào một stage cuối tí hon (Chương 6).</span></div>
</div>
<pre><code><span class="tok-comment"># Hình hài của biên dịch chéo, để tham khảo — Chương 6 dựng nó ra đầy đủ</span>
FROM --platform=&#36;{BUILDPLATFORM} golang:1.23 AS build
ARG TARGETOS TARGETARCH
RUN GOOS=&#36;{TARGETOS} GOARCH=&#36;{TARGETARCH} go build -o /app ./cmd/server

FROM alpine:3.20
COPY --from=build /app /app</code></pre>
<p>Đây là Dockerfile nhỏ nhất cho thấy các tham số dựng đó chứa gì — chính cái đã dùng cho <code>dk03-multi:1</code> ở trên:</p>
<pre><code class="language-dockerfile">FROM --platform=$BUILDPLATFORM alpine:3.20 AS build
ARG BUILDPLATFORM TARGETPLATFORM
RUN echo "dung tren $BUILDPLATFORM cho $TARGETPLATFORM" &gt; /info.txt
FROM alpine:3.20
LABEL dkhoc=03
COPY --from=build /info.txt /info.txt
CMD ["sh", "-c", "cat /info.txt; uname -m"]</code></pre>
<table>
<tr><th>Dòng</th><th>Nó làm gì trong một lượt dựng hai nền tảng</th></tr>
<tr><td><code>FROM --platform=$BUILDPLATFORM … AS build</code></td><td>stage này luôn dùng kiến trúc của máy <em>DỰNG</em> (arm64 trên Mac) — nó chạy native, nhanh, kể cả khi dựng cho amd64</td></tr>
<tr><td><code>ARG BUILDPLATFORM TARGETPLATFORM</code></td><td>BuildKit tự điền; bạn chỉ cần khai báo để dùng được</td></tr>
<tr><td><code>RUN echo …</code></td><td>chạy hai lần (mỗi đích một lần), cả hai lần đều native; một dự án thật sẽ chạy <code>GOOS=… GOARCH=… go build</code> ở đây</td></tr>
<tr><td><code>FROM alpine:3.20</code> (không có <code>--platform</code>)</td><td>stage cuối lấy kiến trúc <em>ĐÍCH</em>: alpine amd64 cho ảnh amd64</td></tr>
<tr><td><code>COPY --from=build</code></td><td>mang kết quả sang; với chương trình đã biên dịch thì phải là bản dựng cho đúng đích đó</td></tr>
</table>
<p>Output chứng minh điều đó: cả hai ảnh đều ghi <code>dung tren linux/arm64</code> — dựng trên arm64 — nhưng <code>cho linux/amd64</code> ở ảnh mà máy chủ đã chạy. Dự án Node.js không có chương trình để biên dịch chéo, nên với chúng mẫu là "cài thư viện trong stage đích", và bước duy nhất bị mô phỏng là <code>npm ci</code> của các mô-đun native — cũng chính là chỗ dựng bằng mô phỏng trở nên chậm.</p>



<h3>Docker 29: đa nền tảng với builder mặc định, và --load chạy được</h3>
<p>Tài liệu của Docker giờ nói thẳng: <em>"Docker Desktop and Docker Engine 29.0+ use the containerd image store by default, which supports multi-platform images out of the box."</em> (Docker Desktop và Docker Engine 29.0+ mặc định dùng kho ảnh containerd, thứ hỗ trợ ảnh đa nền tảng ngay từ đầu.) Hãy kiểm máy mình dùng kho nào trước — một máy nâng cấp lên từ Engine cũ có thể vẫn đang ở overlay2:</p>
<pre><code class="language-bash">docker info --format '{{.DriverStatus}}'</code></pre>
<div class="out">[[driver-type io.containerd.snapshotter.v1]]</div>
<p>Đó là máy Mac của khoá. Với nó, không cần builder đặc biệt nào và không cần registry — Dockerfile ở mục ngay sau, dựng trên builder mặc định <code>desktop-linux</code>:</p>
<pre><code class="language-bash">docker buildx build --platform linux/amd64,linux/arm64 -t dk03-multi:1 --load .
docker run --rm dk03-multi:1
docker run --rm --platform linux/amd64 dk03-multi:1
docker image ls --tree dk03-multi:1</code></pre>
<div class="out">#11 exporting manifest list sha256:e2ff2c8a77d7b03d9a01c2980afd7b5a1a5920c6024f259e5000a8e34e0b581f done
#11 naming to docker.io/library/dk03-multi:1 done
#11 unpacking to docker.io/library/dk03-multi:1 0.0s done
dung tren linux/arm64 cho linux/arm64
aarch64
dung tren linux/arm64 cho linux/amd64
x86_64
IMAGE                ID             DISK USAGE   CONTENT SIZE   EXTRA
dk03-multi:1         e2ff2c8a77d7       25.7MB         7.73MB
├─ linux/amd64       060304a7b1b1       12.1MB         3.63MB
└─ linux/arm64       5d668cf2c045       13.6MB         4.09MB</div>
<p>Một tag cục bộ, hai ảnh thật bên dưới — <code>docker image ls --tree</code> là cách của Docker 29 để nhìn một chỉ mục ngay trên máy mình. Đẩy nó lên và registry nhận trọn chỉ mục, cả chứng thực:</p>
<pre><code class="language-bash">docker tag dk03-multi:1 localhost:18030/dk03-multi:1 &amp;&amp; docker push -q localhost:18030/dk03-multi:1
docker buildx imagetools inspect localhost:18030/dk03-multi:1 | grep -E 'Digest|Platform'</code></pre>
<div class="out">Digest:    sha256:e2ff2c8a77d7b03d9a01c2980afd7b5a1a5920c6024f259e5000a8e34e0b581f
  Platform:    linux/amd64
  Platform:    linux/arm64
  Platform:    unknown/unknown
  Platform:    unknown/unknown</div>
<p>Và máy chủ Linux, kéo cùng tag đó, nhận đúng mục của nó và chạy native: <code>dung tren linux/arm64 cho linux/amd64</code> / <code>x86_64</code>. Việc dựng diễn ra trên máy Mac, bước <code>RUN</code> chạy native trên arm64, vậy mà máy chủ amd64 vẫn nhận được một ảnh amd64 đúng đắn — mục ngay sau giải thích bằng cách nào.</p>
<h3>Ghim nền tảng ở những chỗ có ý nghĩa</h3>
${slide('dk-03', 23, 'Biên dịch chéo: dựng trên máy mình, cho máy đích')}
<pre><code><span class="tok-comment"># Trong Dockerfile, khi một stage phải chạy trên máy DỰNG</span>
FROM --platform=\$BUILDPLATFORM node:22-alpine AS build

<span class="tok-comment"># Trong compose.yaml, khi một dịch vụ không có ảnh cho máy của bạn</span>
services:
  legacy:
    image: someorg/oldthing:2.1
    platform: linux/amd64</code></pre>
<div class="callout ok"><strong><code>platform: linux/amd64</code> trong Compose là cách chữa thực dụng cho MỘT dịch vụ cứng đầu.</strong> Một ảnh cũ không có bản dựng ARM khi đó sẽ chạy dưới mô phỏng trên một laptop Apple Silicon — chậm, nhưng nó CHẠY, và phần còn lại của hệ thống vẫn native. Hãy đặt một dòng chú thích bên cạnh nói rõ vì sao, bởi vì cả một file Compose bị ghim vào <code>linux/amd64</code> là cách một đội rốt cuộc mô phỏng MỌI THỨ rồi tự hỏi sao máy mình chậm thế.</div>
<pre><code>docker buildx rm multi &gt;/dev/null 2&gt;&amp;1; docker rmi alpine:3.20 &gt;/dev/null 2&gt;&amp;1</code></pre>

<h3>Vì sao có lỗi exec format error</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một ảnh được dựng cho MỘT kiến trúc CPU</span><span class="lz-d"><code>linux/amd64</code> hoặc <code>linux/arm64</code>. Các file nhị phân bên trong là mã máy cho đúng tập lệnh đó và không cho gì khác.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Một tag có thể trỏ vào một index, không phải một ảnh</span><span class="lz-d">Một tag đa kiến trúc là một danh sách manifest: daemon chọn mục khớp với nền tảng của chính nó. Đó là lý do <code>node:22</code> chạy được ở mọi nơi.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Dựng trên Apple silicon, chạy trên một VPS x86</span><span class="lz-d">Bản dựng ở máy bạn chỉ cho ra arm64, cái tag giờ trỏ vào một ảnh arm64, và máy chủ không thực thi nổi một lệnh nào trong đó.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Lỗi gọi tên ĐỊNH DẠNG, không gọi tên nguyên nhân</span><span class="lz-d"><code>exec format error</code> — nhân hệ điều hành đang nói với bạn rằng phần đầu ELF là dành cho một loại máy khác. Chẳng gì nhắc tới kiến trúc, và đó là lý do nó đọc lên như một file hỏng.</span></div>
</div>

<h3>Chạy thử từng bước: chẩn đoán một ảnh trong 30 giây</h3>
<ol>
<li>Máy là gì? <code>uname -m</code> (và với Docker: <code>docker version --format '{{.Server.Arch}}'</code>).</li>
<li>Ảnh đang có trên máy là gì? <code>docker image inspect ẢNH --format '{{.Os}}/{{.Architecture}}'</code>.</li>
<li>Registry cung cấp gì dưới tag đó? <code>docker buildx imagetools inspect ẢNH | grep Platform</code>.</li>
<li>Máy này có bộ mô phỏng không? <code>ls /proc/sys/fs/binfmt_misc/</code> trên Linux (chỉ có <code>register</code> và <code>status</code> ⇒ không có).</li>
<li>Quyết định: dựng lại với <code>--platform linux/amd64,linux/arm64</code>, ghim digest <em>chỉ mục</em>, hoặc — cho một dịch vụ bên thứ ba cứng đầu — <code>platform: linux/amd64</code> trong Compose.</li>
</ol>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn dựng API của nhóm trên máy Mac M1, còn một bạn dùng laptop Windows (amd64, WSL2) báo <code>docker compose up</code> hỏng với <code>no matching manifest for linux/amd64</code>. Hãy làm MỘT ảnh chạy được trên cả hai máy, và chứng minh điều đó mà không cần mượn laptop của bạn ấy.</p><ol>
<li>Trong <code>~/thu-docker/multi</code>, viết Dockerfile dựng chéo bảy dòng của bài này.</li>
<li>Dựng một lần chỉ cho máy mình (<code>docker build -t thu-multi:single .</code>) rồi soi: <code>docker image ls --tree thu-multi:single</code> — có bao nhiêu nền tảng?</li>
<li>Dựng cho cả hai: <code>docker buildx build --platform linux/amd64,linux/arm64 -t thu-multi:1 --load .</code>, rồi xem lại <code>--tree</code>.</li>
<li>Chạy cả hai biến thể bằng <code>--platform</code> và đọc hai dòng mỗi cái in ra.</li>
<li>Dọn: <code>docker rmi thu-multi:single thu-multi:1</code>.</li></ol>
<p><strong>Đạt khi:</strong> <code>--tree</code> cho thấy một nền tảng ở lượt dựng đầu và hai nền tảng ở lượt thứ hai, lượt chạy amd64 in ra <code>x86_64</code> và nói nó được dựng trên nền tảng của máy Mac bạn, và bạn giải thích được cho bạn cùng nhóm dòng nào của Dockerfile làm được điều đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Architecture — arch (kiến trúc CPU)</span><span class="v">Tập lệnh của CPU: <code>amd64</code> = <code>x86_64</code>, <code>arm64</code> = <code>aarch64</code>.</span></div>
  <div class="kv"><span class="k">Platform (nền tảng)</span><span class="v"><code>os/arch[/variant]</code>, vd <code>linux/arm64/v8</code> — khoá dùng để tra trong chỉ mục.</span></div>
  <div class="kv"><span class="k">exec format error (lỗi định dạng thực thi)</span><span class="v">Nhân từ chối chạy một chương trình dựng cho CPU khác; exit 255 trên Docker 29.</span></div>
  <div class="kv"><span class="k">Emulation — QEMU / Rosetta (mô phỏng)</span><span class="v">Chạy chương trình "ngoại" bằng cách dịch nó; chạy được, tốn từ ~1,2 lần (Rosetta) tới nhiều lần (QEMU).</span></div>
  <div class="kv"><span class="k">binfmt_misc (bộ định tuyến định dạng)</span><span class="v">Tính năng của Linux tự chuyển chương trình ngoại cho một bộ mô phỏng.</span></div>
  <div class="kv"><span class="k">containerd image store (kho ảnh containerd)</span><span class="v">Kho ảnh của Docker 29 / Desktop; giữ được cả chỉ mục nên <code>--load</code> đa nền tảng chạy được.</span></div>
  <div class="kv"><span class="k">BUILDPLATFORM / TARGETPLATFORM (nền tảng dựng / đích)</span><span class="v">Tham số dựng: máy đang dựng và máy sẽ chạy ảnh.</span></div>
  <div class="kv"><span class="k">Cross-compilation (biên dịch chéo)</span><span class="v">Tạo chương trình cho kiến trúc khác ngay trên máy dựng, native — nhanh và chắc.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một ảnh chứa mã máy cho một CPU; tag đa kiến trúc là một chỉ mục và mỗi máy tự chọn mục của nó.</li>
<li>Qua registry, thiếu nền tảng thì hỏng lúc kéo (<code>no matching manifest</code>); qua save/load hay digest nền tảng thì hỏng lúc chạy (<code>exec format error</code>, exit 255).</li>
<li>Chẩn đoán bằng <code>uname -m</code>, <code>.Architecture</code> và <code>imagetools inspect</code> — ba lệnh.</li>
<li>Trên Mac, amd64 chạy qua Rosetta khoảng 1,2 lần; kiến trúc khác qua QEMU chậm gấp vài lần.</li>
<li>Kho containerd của Docker 29 dựng và <code>--load</code> ảnh đa nền tảng bằng builder mặc định.</li>
<li>Dùng <code>FROM --platform=$BUILDPLATFORM</code> để làm việc nặng native, chỉ stage cuối theo từng đích.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/building/multi-platform/" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">Dựng đa nền tảng</span><span class="lc-sub">Ba chiến lược — mô phỏng, nút native, biên dịch chéo — kèm đánh đổi của từng cái, cộng bảng tham số dựng <code>TARGETPLATFORM</code> mà bạn sẽ cần khi biên dịch chéo.</span></span>
</a>
<a class="link-card" href="https://github.com/tonistiigi/binfmt" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">tonistiigi/binfmt</span><span class="lc-sub">Cách một-câu-lệnh để đăng ký bộ mô phỏng QEMU trên máy chủ Linux. README của nó giải thích <code>binfmt_misc</code> đang làm gì, và điều đó gỡ bỏ vẻ huyền bí của việc vì sao một chương trình ngoại lai lại chạy được.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/builders/drivers/" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Trình điều khiển của Buildx</span><span class="lc-sub">docker, docker-container, kubernetes và remote — cái nào làm được gì, và cụ thể là cái nào hỗ trợ output đa nền tảng cùng bộ đệm bên ngoài.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: vượt qua ranh giới kiến trúc</span><span class="lc-sub">Bài chấm điểm: chẩn đoán một cú <code>exec format error</code> chỉ bằng hai câu lệnh, liệt kê các nền tảng trong một chỉ mục đã công bố, tự đo mức phạt của mô phỏng, và giải thích vì sao <code>--load</code> hỏng với một lượt dựng đa nền tảng.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> một lập trình viên dùng Mac Apple Silicon chạy <code>docker build -t app:1.0 . &amp;&amp; docker push app:1.0</code>. Lượt dựng mặc định theo nền tảng của máy chủ, nên một cái ảnh chỉ có arm64 đi lên registry, và cái máy chủ production x86 hỏng với <code>exec format error</code> — sau một lượt dựng thành công, một lượt đẩy thành công và một lượt deploy thành công. Ba bước xanh và một dịch vụ chết. Cách chữa, theo thứ tự ưu tiên: dựng trong CI trên một máy chạy x86; hoặc luôn dựng bằng <code>docker buildx build --platform linux/amd64,linux/arm64 --push</code>; hoặc tối thiểu là thêm một phép kiểm vào script deploy — <code>docker buildx imagetools inspect "\$IMAGE" | grep -q 'linux/amd64'</code> — để nó TỪ CHỐI triển khai một cái ảnh mà máy chủ không chạy được.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> <code>exec format error</code> trên một chương trình thật nghĩa là sai kiến trúc (trên script của chính bạn thì kiểm dòng <code>#!</code> của nó trước — xem ô bẫy phía trên): so <code>docker inspect --format '{{.Architecture}}'</code> với <code>uname -m</code> là xong phần chẩn đoán. Một cái tag có thể là một CHỈ MỤC gồm nhiều ảnh theo từng nền tảng, và <code>docker buildx imagetools inspect</code> là cách bạn nhìn thấy bên trong đó thật sự có gì. Và mô phỏng thì chạy được nhưng tốn 5–20 lần — hãy dựng native hoặc biên dịch chéo cho bất cứ thứ gì bạn làm thường xuyên hơn thi thoảng.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.5 ─────────────────────────── */
    {
      title: '3.5 — Keeping /var/lib/docker from eating the disk|||3.5 — Giữ cho /var/lib/docker khỏi nuốt cả cái đĩa',
      slug: 'dk-3-5-don-dia',
      type: 'LESSON',
      description: 'Ảnh mồ côi từ đâu ra, thang dọn dẹp từ an toàn tới nguy hiểm, prune với bộ lọc thời gian, vì sao -a trên máy chủ xoá luôn bản để quay lui, và tự động hoá việc dọn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>Keeping /var/lib/docker from eating the disk</h2>
<p class="lead">Docker never deletes anything on its own. Every image you have ever pulled, every intermediate build layer, every stopped container and every anonymous volume stays until something removes it — and on a server that builds and deploys regularly, that is tens of gigabytes a month. A full disk takes the database down with it, so this is worth twenty minutes now.</p>

<h3>Where the space actually is</h3>
${slide('dk-03', 24, 'docker system df: máy dựng ở nhà đang ôm 355 GB bộ đệm')}
<pre><code>docker system df
docker system df -v | head -20
df -h /var/lib/docker | tail -1</code></pre>
<div class="out">TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          31        4         18.42GB   14.91GB (80%)
Containers      12        3         241.7MB   198.3MB (82%)
Local Volumes   9         2         6.114GB   4.882GB (79%)
Build Cache     412       0         11.03GB   11.03GB (100%)
/dev/vda1        79G       61G       15G      81% /</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Images · RECLAIMABLE</span><span class="v">Images no running container is using. Includes every old version of your app and every base image you tried once. The single biggest number on most machines after build cache.</span></div>
  <div class="kv"><span class="k">Build Cache</span><span class="v">BuildKit's layer cache. Grows with every build, and is almost entirely reclaimable — deleting it only costs you a slower next build. (Real machines show less than 100%: records still shared with an active build or with each other are not counted, which is why Docker 29 prints no percentage for this row — see the measurements below.) This is the first thing to clear and the one that most often is not.</span></div>
  <div class="kv"><span class="k">Local Volumes · RECLAIMABLE</span><span class="v">Volumes no container references. Here be dragons: this number includes the anonymous volume holding a database from a container you deleted last month, which may be the only copy of that data.</span></div>
  <div class="kv"><span class="k">Containers</span><span class="v">Writable layers of stopped containers. Usually small, occasionally not — a container that logged to a file inside itself can be gigabytes.</span></div>
</div>
<pre><code><span class="tok-comment"># Which images specifically, biggest first</span>
docker images --format '{{.Size}}\\t{{.Repository}}:{{.Tag}}\\t{{.CreatedSince}}' | sort -hr | head -8
<span class="tok-comment"># And the dangling ones — untagged, referenced by nothing</span>
docker images -f dangling=true --format '{{.ID}} {{.Size}} {{.CreatedSince}}' | head -5</code></pre>
<div class="out">1.83GB	myapp:2026-08-19-c3d4e5f	3 days ago
1.82GB	myapp:2026-08-18-b2c3d4e	4 days ago
1.81GB	&lt;none&gt;:&lt;none&gt;	5 days ago
274MB	postgres:16-alpine	3 weeks ago
c8a1b2d3e4f5 1.81GB 5 days ago
9e8d7c6b5a4f 1.79GB 6 days ago</div>
<p>Three builds of the same application, 5.5GB, because each one is a fresh set of layers. The <code>&lt;none&gt;</code> entries are <strong>dangling</strong>: they had a tag once and lost it when a rebuild moved that tag to a new image (Lesson 3.2). Nothing references them and nothing will.</p>


<h3>Two real machines, read column by column</h3>
<p>The table above is a typical VPS. Here are the two machines this course was recorded on, on 23/09/2026 — <code>docker system df</code> only reads, so run it anywhere without fear:</p>
<pre><code class="language-bash">docker system df          <span class="tok-comment"># course Mac (Docker Desktop)</span></code></pre>
<div class="out">TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          77        20        36.8GB    25.09GB (68%)
Containers      43        14        883MB     553.7MB (62%)
Local Volumes   68        26        9.098GB   4.158GB (45%)
Build Cache     482       0         32.29GB   17.73GB</div>
<pre><code class="language-bash">docker system df; df -h / | tail -1     <span class="tok-comment"># the Linux machine that builds a student project's images for deploy</span></code></pre>
<div class="out">TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          326       3         201.7GB   172.7GB (85%)
Containers      3         3         8.192kB   0B (0%)
Local Volumes   23        2         629.4MB   245.8MB (39%)
Build Cache     875       0         355.1GB   305.8GB
/dev/nvme0n1p1  477G  294G  168G  64% /</div>
<table>
<tr><th>Column</th><th>How to read it</th><th>On the Linux build machine</th></tr>
<tr><td>TOTAL</td><td>how many objects of that type exist</td><td>326 images — two tags per release, every release kept</td></tr>
<tr><td>ACTIVE</td><td>used by at least one container (running <em>or stopped</em>)</td><td>only 3 images are in use</td></tr>
<tr><td>SIZE</td><td>disk used; for images, shared layers are counted once</td><td>201.7 GB of images, 355.1 GB of build cache</td></tr>
<tr><td>RECLAIMABLE</td><td>what could go without touching an ACTIVE object</td><td>172.7 GB + 305.8 GB ≈ 478 GB "on paper"</td></tr>
</table>
<p>Two lessons hide in those numbers. First, the reclaimable figures overlap and are estimates — 478 GB "reclaimable" on a disk with 294 GB used cannot all be real, because images and build cache share content in the containerd store. Treat RECLAIMABLE as a ranking ("build cache first"), not a promise. Second, a machine that builds is a different animal from a machine that only runs: the VPS of the same project once died mid-deploy with <code>no space left on device</code> when its build cache reached 7.6 GB on a small disk that also held PostgreSQL. The cure was structural — build on the big home machine, let the VPS only pull and run — plus the automatic cleanup at the end of this lesson.</p>
<h3>The cleanup ladder</h3>
${slide('dk-03', 25, 'Thang dọn đĩa: leo từ dưới lên, rủi ro tăng mỗi bậc')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Build cache — zero risk</span><span class="lz-t">docker builder prune -f</span><span class="lz-d">Costs only a slower next build. Often frees more than everything else combined. Start here, always.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Dangling images — zero risk</span><span class="lz-t">docker image prune -f</span><span class="lz-d">Untagged images only. Nothing can reference them by name, so nothing can break.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Stopped containers — near-zero risk</span><span class="lz-t">docker container prune -f</span><span class="lz-d">You lose their logs and exit codes. Check for anything you still need to look at first — <code>docker ps -a --filter status=exited</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Old tagged images — think first</span><span class="lz-t">docker image prune -a --filter "until=336h"</span><span class="lz-d">Removes tagged images older than two weeks that no container uses. Costs a re-pull, and on a production host it may remove the image you would roll back to.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Volumes — DANGEROUS</span><span class="lz-t">docker volume ls -f dangling=true, then read the list</span><span class="lz-d">Never prune volumes reflexively. Look at each one, confirm what it holds, and take a backup of anything you are unsure about. This is the step that deletes databases.</span></div>
</div>
<pre><code>docker builder prune -f
docker image prune -f
docker container prune -f
docker system df</code></pre>
<div class="out">Total reclaimed space: 11.03GB
Total reclaimed space: 5.41GB
Total reclaimed space: 198.3MB
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          19        4         13.01GB   9.52GB (73%)
Containers      3         3         43.4MB    0B (0%)
Local Volumes   9         2         6.114GB   4.882GB (79%)
Build Cache     0         0         0B        0B</div>

<p>What each prune command actually considers "unused" — this is where people get hurt, so it is worth a table:</p>
<table>
<tr><th>Command</th><th>Removes</th><th>Keeps</th></tr>
<tr><td><code>docker builder prune</code></td><td>build cache not used by a running build</td><td>nothing else is touched</td></tr>
<tr><td><code>docker image prune</code></td><td>dangling images (<code>&lt;none&gt;</code>) only</td><td>every tagged image</td></tr>
<tr><td><code>docker image prune -a</code></td><td>every image not used by <em>any</em> container, tagged or not</td><td>images of existing containers (running or stopped)</td></tr>
<tr><td><code>docker container prune</code></td><td>all stopped containers (with their logs and writable layers)</td><td>running containers</td></tr>
<tr><td><code>docker volume prune</code></td><td><strong>anonymous</strong> volumes no container uses</td><td>named volumes (since Docker Engine 23)</td></tr>
<tr><td><code>docker volume prune -a</code></td><td>every unused volume, named ones included</td><td>volumes attached to some container</td></tr>
<tr><td><code>docker system prune</code></td><td>stopped containers + unused networks + dangling images + build cache</td><td>volumes (unless <code>--volumes</code>, which adds anonymous ones)</td></tr>
</table>
<p>Every one of them accepts <code>--filter</code>, and that is the safe way to practise: give your experiments a label and prune <em>only</em> that label. This course does exactly that — every object it creates carries <code>--label dkhoc=03</code> (or <code>LABEL dkhoc=03</code> in the Dockerfile), so a demo prune can never reach the other 60-odd volumes on the machine.</p>
<p>16.6GB from three zero-risk commands. That is the usual shape: most of what accumulates is cache and dangling layers, and clearing it requires no judgement at all.</p>

<h3>Filters, so you keep what matters</h3>
${slide('dk-03', 26, 'prune -a xoá luôn bản bạn định quay lui về')}
<pre><code><span class="tok-comment"># Everything unused older than a week, but keep anything labelled as protected</span>
docker image prune -a -f \\
  --filter "until=168h" \\
  --filter "label!=keep=true"

<span class="tok-comment"># Build cache older than 7 days, or above a size ceiling</span>
docker builder prune -f --filter "until=168h"
docker builder prune -f --keep-storage 10GB

<span class="tok-comment"># Look before you leap: --dry-run is not a flag, so list first</span>
docker images -a -f "until=168h" --format '{{.Repository}}:{{.Tag}} {{.Size}}'</code></pre>
<div class="out">Total reclaimed space: 3.88GB
Total reclaimed space: 0B
myapp:2026-08-01-9a8b7c6 1.79GB
node:20-alpine 178MB</div>
<div class="callout warn"><strong><code>docker system prune -a</code> on a production server deletes your rollback.</strong> The <code>-a</code> flag removes every image not used by a <em>running</em> container — which includes the previous release you would redeploy if this one turns out to be broken. Suddenly a rollback means pulling from the registry, which is fine until the registry is the thing that is down, or the network is slow, or you are doing this at 3am. Prefer <code>--filter "until=…"</code> with a window longer than your rollback horizon, and keep the last two or three releases on the host on purpose.</div>


<p class="note-ct">Docker 29's CLI renamed one flag used above: <code>docker builder prune --keep-storage 10GB</code> still works but prints <code>Flag --keep-storage has been deprecated, keep-storage flag has been changed to reserved-space</code>. The new flags are <code>--reserved-space</code> (always keep this much cache), <code>--max-used-space</code> and <code>--min-free-space</code>.</p>
<h3>Try it step by step: watch -a take your rollback (safely, with a label)</h3>
<p>Three releases of a small web image were pushed from the Mac and pulled on the Linux "server"; v3 is running, v1 and v2 are the rollback candidates. Every image carries <code>LABEL dkhoc=03</code>, so the prunes below can only ever see these:</p>
<pre><code class="language-bash">docker run -d --name web localhost:18030/dk03-web:v3 sleep 600
docker images --filter label=dkhoc=03 --format '{{.Repository}}:{{.Tag}} {{.ID}}'
docker image prune -f --filter label=dkhoc=03          <span class="tok-comment"># step 2 of the ladder</span>
docker image prune -a -f --filter label=dkhoc=03       <span class="tok-comment"># step 4 — watch what goes</span>
docker images --filter label=dkhoc=03 --format '{{.Repository}}:{{.Tag}} {{.ID}}'</code></pre>
<div class="out">localhost:18030/dk03-web:v3 bbc911fc7624
localhost:18030/dk03-web:v2 782802ea637a
localhost:18030/dk03-web:v1 f934ee732cd4
…
untagged: localhost:18030/dk03-web:v1
untagged: localhost:18030/dk03-web:v2
…
Total reclaimed space: 14.6MB
localhost:18030/dk03-web:v3 bbc911fc7624</div>
<p>The plain prune found only the two leftover <code>&lt;none&gt;</code> images from Lesson 3.2 (reclaiming 17.6 kB — they shared every real layer with tagged images). The <code>-a</code> prune removed v1 and v2 without a question, because no container used them. If v3 turns out broken at 3 a.m., rollback is now a pull from the registry — fine when the registry is up and the network is fast, painful otherwise. Protect what you might need:</p>
<pre><code class="language-bash"><span class="tok-comment"># keep images younger than two weeks</span>
docker image prune -a -f --filter "until=336h"
<span class="tok-comment"># or mark the last releases at build time and exclude them</span>
docker build --label keep=true -t app:1.4.2 .
docker image prune -a -f --filter "label!=keep=true"</code></pre>
<h3>Volumes deserve their own paragraph</h3>
${slide('dk-03', 27, 'volume prune chỉ xoá volume vô danh — vẫn phải nhìn trước')}
<pre><code>docker volume ls -f dangling=true
docker volume inspect \$(docker volume ls -qf dangling=true | head -1) \\
  --format '{{.Name}} {{.Mountpoint}} {{.CreatedAt}}'
sudo du -sh /var/lib/docker/volumes/* 2&gt;/dev/null | sort -hr | head -5</code></pre>
<div class="out">DRIVER    VOLUME NAME
local     4f9a2c1e8b3d7f6a5c4b3a29180716f5e4d3c2b1a09f8e7d6c5b4a3928170615
local     pgdata_old
4f9a2c1e8b3d… /var/lib/docker/volumes/4f9a2c1e8b3d…/_data 2026-07-14T09:12:03Z
3.9G	/var/lib/docker/volumes/4f9a2c1e8b3d7f6a5c4b3a29180716f5e4d3c2b1a09f8e7d6c5b4a3928170615
1.1G	/var/lib/docker/volumes/pgdata
890M	/var/lib/docker/volumes/pgdata_old
<span class="tok-comment"># That 3.9G random name is an anonymous volume — quite possibly a database.</span></div>
<pre><code><span class="tok-comment"># Look inside before deciding anything</span>
sudo ls /var/lib/docker/volumes/4f9a2c1e8b3d…/_data | head -5
<span class="tok-comment"># Or without root, through a container:</span>
docker run --rm -v 4f9a2c1e8b3d…:/v alpine ls -la /v | head -5</code></pre>
<div class="out">PG_VERSION  base  global  pg_wal  postgresql.conf</div>
<p>That is a PostgreSQL data directory. It became anonymous because someone ran <code>postgres</code> without <code>-v</code>, Docker honoured the image's <code>VOLUME</code> declaration with a random name, and the container was later deleted (Lesson 1.4). <code>docker volume prune</code> would have removed it without asking. Name your volumes; then a listing is readable and this decision never has to be made under pressure.</p>


<h3>Try it step by step: find out what an anonymous volume holds, without root</h3>
<p>Reproduced on the course Mac with a throwaway Postgres run the "wrong" way — no <code>-v</code>:</p>
<pre><code class="language-bash">docker run -d --name pg -e POSTGRES_PASSWORD=x postgres:16-alpine; sleep 6
V=$(docker inspect pg --format '{{range .Mounts}}{{.Name}}{{end}}'); echo $V
docker rm -f pg                                   <span class="tok-comment"># the container goes, the volume stays</span>
docker volume inspect $V --format '{{.Name}} {{.CreatedAt}} {{json .Labels}}'
docker run --rm -v $V:/v:ro alpine:3.20 ls /v | head -8
docker run --rm -v $V:/v:ro alpine:3.20 cat /v/PG_VERSION
docker run --rm -v $V:/v:ro alpine:3.20 du -sh /v</code></pre>
<div class="out">daf727d8ac4ec07eb0304491b20e80028239163e1d2f3104fb51f1120183e513
daf727d8ac4ec07eb0304491b20e80028239163e1d2f3104fb51f1120183e513 2026-09-23T14:14:15Z {"com.docker.volume.anonymous":""}
PG_VERSION
base
global
pg_commit_ts
pg_dynshmem
pg_hba.conf
pg_ident.conf
pg_logical
16
38.3M	/v</div>
<table>
<tr><th>Clue</th><th>What it tells you</th></tr>
<tr><td>64-hex name</td><td>nobody named it — created by an image's <code>VOLUME</code> line or a bare <code>-v /path</code></td></tr>
<tr><td>label <code>com.docker.volume.anonymous</code></td><td>Docker itself marks it anonymous — this is what <code>docker volume prune</code> (without <code>-a</code>) will take</td></tr>
<tr><td><code>PG_VERSION</code>, <code>base</code>, <code>pg_wal</code></td><td>a PostgreSQL data directory; <code>PG_VERSION</code> says which major (16)</td></tr>
<tr><td><code>:ro</code> on the mount</td><td>you look without any chance of changing it</td></tr>
</table>
<p>Then decide: back it up (<code>docker run --rm -v $V:/v:ro -v "$PWD":/out alpine:3.20 tar czf /out/pg-cu.tgz -C /v .</code>), re-attach it to a new Postgres (Lesson 1.4), or remove it by name with <code>docker volume rm $V</code> once you are sure. On the Mac, the same listing <code>docker volume ls -f dangling=true</code> showed 46 unused volumes from other projects — which is exactly why you inspect <em>one by name</em> instead of pruning the lot.</p>
<p class="note-ct">The same run also confirmed the named/anonymous rule on Docker 29: <code>docker volume create --label dkhoc=03 dk03-named</code>, then <code>docker volume prune -f --filter label=dkhoc=03</code> printed <code>Total reclaimed space: 0B</code> and left it alone; only <code>docker volume prune -a -f --filter label=dkhoc=03</code> printed <code>Deleted Volumes: dk03-named</code>.</p>
<h3>Automate the safe part</h3>
${slide('dk-03', 28, 'Tự động hoá phần an toàn, để phần nguy hiểm cho người')}
<pre><code><span class="tok-comment"># /etc/systemd/system/docker-prune.service</span>
[Unit]
Description=Reclaim Docker build cache and dangling images

[Service]
Type=oneshot
ExecStart=/usr/bin/docker builder prune -f --filter until=168h
ExecStart=/usr/bin/docker image prune -f
ExecStart=/usr/bin/docker container prune -f --filter until=168h</code></pre>
<pre><code><span class="tok-comment"># /etc/systemd/system/docker-prune.timer</span>
[Unit]
Description=Weekly Docker cleanup

[Timer]
OnCalendar=Sun 04:00
Persistent=true
RandomizedDelaySec=1800

[Install]
WantedBy=timers.target</code></pre>
<pre><code>sudo systemctl daemon-reload
sudo systemctl enable --now docker-prune.timer
systemctl list-timers docker-prune.timer --no-pager</code></pre>
<div class="out">NEXT                        LEFT      LAST  PASSED  UNIT                ACTIVATES
Sun 2026-08-24 04:00:00 UTC 1 day 6h  -     -       docker-prune.timer  docker-prune.service</div>
<div class="callout ok"><strong>Note what is <em>not</em> in that timer: <code>-a</code> and <code>--volumes</code>.</strong> Automated cleanup should only ever do the operations that cannot lose anything — build cache, dangling images, old stopped containers. Anything that requires judgement stays manual, because a cron job cannot look at a volume and decide whether it is a database. This is also the single best defence against the 3am disk-full incident, and it costs one file.</div>
<p>There is an even lazier option for the build cache: let the daemon cap it for you. This is the example from Docker's garbage-collection documentation — put it in <code>/etc/docker/daemon.json</code> on Linux, or in Docker Desktop → Settings → Docker Engine:</p>
<pre><code class="language-json">{
  "builder": {
    "gc": {
      "enabled": true,
      "defaultKeepStorage": "20GB"
    }
  }
}</code></pre>
<p>With that, BuildKit trims its own cache back to about 20 GB in the background — no timer to forget. Changing <code>daemon.json</code> needs a daemon reload or restart, and on a production server that is a moment to plan (Chapter 1's <code>live-restore</code>); on Docker Desktop, "Apply &amp; restart" restarts the VM and every container in it.</p>



<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> Docker Desktop on your Mac says the disk image is almost full the week before the SWP391 demo, and a teammate suggests <code>docker system prune -a --volumes</code>. You want the space back <em>without</em> losing the team's local database or anything you would need to redo.</p><ol>
<li>Measure: run <code>docker system df</code> and write the four SIZE and RECLAIMABLE numbers into <code>~/thu-docker/dia.txt</code>.</li>
<li>Rehearse on your own labelled objects first: build any small image twice with <code>--label thu=1</code>, create a volume with <code>--label thu=1</code>, then run each prune with <code>--filter label=thu=1</code> and predict before each one what will disappear.</li>
<li>Climb the real ladder only as far as step 2: <code>docker builder prune -f</code>, then <code>docker image prune -f</code>. Record the "Total reclaimed space" lines.</li>
<li>List (do not delete) <code>docker volume ls -f dangling=true</code>; pick one name and look inside it read-only as in the step-by-step above.</li>
<li>Run <code>docker system df</code> again and write the new numbers under the old ones.</li></ol>
<p><strong>Done when:</strong> <code>dia.txt</code> shows before/after numbers, the Build Cache row went down, every prediction in step 2 matched what happened, and no volume was deleted except the one you labelled yourself.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">docker system df</span><span class="v">A read-only report of disk used by images, containers, volumes and build cache.</span></div>
  <div class="kv"><span class="k">Reclaimable</span><span class="v">Space that could be freed without touching anything in use — an estimate, not a promise.</span></div>
  <div class="kv"><span class="k">Build cache</span><span class="v">BuildKit's stored intermediate results; safe to delete, costs a slower next build.</span></div>
  <div class="kv"><span class="k">Prune</span><span class="v">Docker's "delete everything unused of this type" commands; each defines "unused" differently.</span></div>
  <div class="kv"><span class="k">Filter (until / label)</span><span class="v">Limits a prune to objects older than a time or carrying (or not carrying) a label.</span></div>
  <div class="kv"><span class="k">Rollback image</span><span class="v">The previous release kept on the server so you can switch back in seconds.</span></div>
  <div class="kv"><span class="k">Anonymous volume</span><span class="v">A randomly named volume, labelled <code>com.docker.volume.anonymous</code>; the only kind a plain volume prune removes.</span></div>
  <div class="kv"><span class="k">Builder GC</span><span class="v"><code>builder.gc</code> in <code>daemon.json</code>: the daemon keeps build cache under a size you choose.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Docker deletes nothing on its own; <code>docker system df</code> is the read-only first step.</li>
<li>Build cache and dangling images are the safe first rungs — and usually most of the space.</li>
<li><code>-a</code> removes every image no container uses, which on a server means your rollback.</li>
<li>Plain <code>volume prune</code> takes only anonymous volumes — which is exactly where a forgotten database lives; look inside first.</li>
<li>Practise and automate with <code>--filter</code> (<code>until=</code>, <code>label=</code>); never automate <code>-a</code> or <code>--volumes</code>.</li>
<li>Cap the build cache with <code>builder.gc</code>, and keep builds off the machine that holds the database.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/manage-resources/pruning/" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">Pruning unused Docker objects</span><span class="lc-sub">Every prune subcommand, exactly what each one considers "unused", and the full filter syntax. Read the volume section twice before running it anywhere real.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/system/df/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">docker system df</span><span class="lc-sub">Including <code>-v</code>, which breaks the totals down per image, per container and per volume — the view that tells you what to delete rather than just how much there is.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/cache/garbage-collection/" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">BuildKit cache garbage collection</span><span class="lc-sub">Configuring automatic cache limits in <code>/etc/docker/daemon.json</code> so the build cache never grows past a ceiling you choose — better than remembering to prune.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: reclaim the disk</span><span class="lc-sub">Graded exercises: read <code>docker system df</code> and say what to clear first, identify an anonymous volume's contents without root, write a prune filter that keeps the last two releases, and explain what <code>system prune -a</code> would have cost.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>docker system prune -a --volumes</code> as a reflex when a disk fills. It removes every unused image, every stopped container, every network — and <strong>every anonymous volume not attached to a container</strong> (since Docker Engine 23 named volumes are skipped unless you also use <code>docker volume prune -a</code> — older engines took named ones too). If your database volume was anonymous — the default when Postgres runs without <code>-v</code> — and its container had already been removed, the data is gone, with no confirmation beyond a generic <code>y/N</code> that does not name what it is about to delete. There is no undo. Run the ladder above in order, never add <code>--volumes</code> to an automated job, and take a backup before any cleanup on a machine holding data you cannot recreate.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Build cache and dangling images are usually most of the problem and are risk-free to delete, so <code>docker builder prune</code> and <code>docker image prune</code> come first, always. <code>-a</code> removes images no <em>running</em> container uses, which on a server includes the release you would roll back to — use <code>--filter until=</code> with a window wider than your rollback horizon. And never automate volume pruning: name your volumes, look inside before deleting, and remember that an anonymous volume with a random name is quite often somebody's database.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Giữ cho /var/lib/docker khỏi nuốt cả cái đĩa</h2>
<p class="lead">Docker KHÔNG BAO GIỜ tự xoá thứ gì. Mọi cái ảnh bạn từng kéo về, mọi tầng dựng trung gian, mọi container đã dừng và mọi volume vô danh đều nằm lại cho tới khi có thứ gì đó gỡ chúng đi — và trên một máy chủ dựng với deploy đều đặn thì đó là hàng chục gigabyte mỗi tháng. Một cái đĩa đầy kéo theo cả cơ sở dữ liệu, nên chuyện này đáng bỏ hai mươi phút NGAY BÂY GIỜ.</p>

<h3>Chỗ trống thật ra nằm ở đâu</h3>
${slide('dk-03', 24, 'docker system df: máy dựng ở nhà đang ôm 355 GB bộ đệm')}
<pre><code>docker system df
docker system df -v | head -20
df -h /var/lib/docker | tail -1</code></pre>
<div class="out">TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          31        4         18.42GB   14.91GB (80%)
Containers      12        3         241.7MB   198.3MB (82%)
Local Volumes   9         2         6.114GB   4.882GB (79%)
Build Cache     412       0         11.03GB   11.03GB (100%)
/dev/vda1        79G       61G       15G      81% /</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Images · RECLAIMABLE</span><span class="v">Những ảnh mà không container đang chạy nào dùng. Gồm cả mọi phiên bản cũ của ứng dụng bạn và mọi ảnh nền bạn thử một lần rồi thôi. Con số lớn nhất trên hầu hết các máy, chỉ sau bộ đệm dựng.</span></div>
  <div class="kv"><span class="k">Build Cache</span><span class="v">Bộ đệm tầng của BuildKit. Phình lên ở mỗi lượt dựng, và gần như thu hồi được toàn bộ — xoá nó chỉ khiến lượt dựng kế tiếp chậm hơn. (Máy thật cho thấy ít hơn 100%: những bản ghi còn dùng chung với một lượt dựng đang chạy hoặc với nhau thì không được tính, và đó là lý do Docker 29 không in phần trăm cho dòng này — xem số đo ngay dưới.) Đây là thứ đầu tiên nên dọn và là thứ hay bị bỏ quên nhất.</span></div>
  <div class="kv"><span class="k">Local Volumes · RECLAIMABLE</span><span class="v">Những volume không container nào tham chiếu. Ở đây có rồng: con số này bao gồm cả cái volume vô danh đang giữ một cơ sở dữ liệu từ một container bạn xoá tháng trước, và đó có thể là bản duy nhất của dữ liệu ấy.</span></div>
  <div class="kv"><span class="k">Containers</span><span class="v">Tầng ghi được của các container đã dừng. Thường nhỏ, thỉnh thoảng thì không — một container ghi log vào một file bên trong chính nó có thể nặng hàng gigabyte.</span></div>
</div>
<pre><code><span class="tok-comment"># Cụ thể là những ảnh nào, lớn nhất trước</span>
docker images --format '{{.Size}}\\t{{.Repository}}:{{.Tag}}\\t{{.CreatedSince}}' | sort -hr | head -8
<span class="tok-comment"># Và những cái mồ côi — không tag, không gì tham chiếu tới</span>
docker images -f dangling=true --format '{{.ID}} {{.Size}} {{.CreatedSince}}' | head -5</code></pre>
<div class="out">1.83GB	myapp:2026-08-19-c3d4e5f	3 days ago
1.82GB	myapp:2026-08-18-b2c3d4e	4 days ago
1.81GB	&lt;none&gt;:&lt;none&gt;	5 days ago
274MB	postgres:16-alpine	3 weeks ago
c8a1b2d3e4f5 1.81GB 5 days ago
9e8d7c6b5a4f 1.79GB 6 days ago</div>
<p>Ba lượt dựng của cùng một ứng dụng, 5,5GB, vì mỗi lượt là một bộ tầng mới. Những dòng <code>&lt;none&gt;</code> là ảnh <strong>MỒ CÔI</strong>: chúng từng có tag rồi mất nó khi một lượt dựng lại dời cái tag đó sang một ảnh mới (Bài 3.2). Không gì tham chiếu tới chúng và sẽ không bao giờ có.</p>


<h3>Hai máy thật, đọc từng cột một</h3>
<p>Bảng ở trên là một VPS điển hình. Đây là hai máy mà khoá được ghi lại, ngày 23/09/2026 — <code>docker system df</code> chỉ đọc, nên cứ chạy ở đâu cũng được, không có gì phải sợ:</p>
<pre><code class="language-bash">docker system df          <span class="tok-comment"># máy Mac của khoá (Docker Desktop)</span></code></pre>
<div class="out">TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          77        20        36.8GB    25.09GB (68%)
Containers      43        14        883MB     553.7MB (62%)
Local Volumes   68        26        9.098GB   4.158GB (45%)
Build Cache     482       0         32.29GB   17.73GB</div>
<pre><code class="language-bash">docker system df; df -h / | tail -1     <span class="tok-comment"># máy Linux dựng ảnh để deploy cho một dự án sinh viên</span></code></pre>
<div class="out">TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          326       3         201.7GB   172.7GB (85%)
Containers      3         3         8.192kB   0B (0%)
Local Volumes   23        2         629.4MB   245.8MB (39%)
Build Cache     875       0         355.1GB   305.8GB
/dev/nvme0n1p1  477G  294G  168G  64% /</div>
<table>
<tr><th>Cột</th><th>Đọc thế nào</th><th>Trên máy Linux dựng ảnh</th></tr>
<tr><td>TOTAL</td><td>có bao nhiêu đối tượng loại đó</td><td>326 ảnh — mỗi bản phát hành hai tag, bản nào cũng giữ lại</td></tr>
<tr><td>ACTIVE</td><td>đang được ít nhất một container dùng (đang chạy <em>HOẶC đã dừng</em>)</td><td>chỉ 3 ảnh đang được dùng</td></tr>
<tr><td>SIZE</td><td>dung lượng đĩa; với ảnh thì tầng dùng chung chỉ tính một lần</td><td>201,7 GB ảnh, 355,1 GB bộ đệm dựng</td></tr>
<tr><td>RECLAIMABLE</td><td>thứ có thể bỏ đi mà không đụng vào đối tượng ACTIVE nào</td><td>172,7 GB + 305,8 GB ≈ 478 GB "trên giấy"</td></tr>
</table>
<p>Có hai bài học nấp trong mấy con số đó. Thứ nhất, các con số thu hồi được chồng lên nhau và chỉ là ước lượng — 478 GB "thu hồi được" trên một cái đĩa mới dùng 294 GB thì không thể thật hết, vì ảnh và bộ đệm dựng dùng chung nội dung trong kho containerd. Hãy coi RECLAIMABLE là một bảng xếp hạng ("dọn bộ đệm dựng trước"), không phải một lời hứa. Thứ hai, máy DỰNG là một loài khác hẳn máy chỉ CHẠY: VPS của chính dự án đó từng chết giữa lúc deploy với <code>no space left on device</code> khi bộ đệm dựng lên tới 7,6 GB trên một cái đĩa nhỏ đang chứa cả PostgreSQL. Cách chữa là thay đổi cấu trúc — dựng trên máy nhà cấu hình lớn, để VPS chỉ kéo về và chạy — cộng với việc dọn tự động ở cuối bài này.</p>
<h3>Cái thang dọn dẹp</h3>
${slide('dk-03', 25, 'Thang dọn đĩa: leo từ dưới lên, rủi ro tăng mỗi bậc')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Bộ đệm dựng — không rủi ro</span><span class="lz-t">docker builder prune -f</span><span class="lz-d">Chỉ tốn một lượt dựng kế tiếp chậm hơn. Thường giải phóng nhiều hơn tất cả những cái còn lại cộng lại. Hãy bắt đầu từ đây, luôn luôn.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Ảnh mồ côi — không rủi ro</span><span class="lz-t">docker image prune -f</span><span class="lz-d">Chỉ những ảnh không có tag. Không gì tham chiếu tới chúng bằng tên được, nên không gì hỏng được.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Container đã dừng — gần như không rủi ro</span><span class="lz-t">docker container prune -f</span><span class="lz-d">Bạn mất log và mã thoát của chúng. Hãy kiểm trước xem còn thứ gì bạn cần xem không — <code>docker ps -a --filter status=exited</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Ảnh cũ có tag — nghĩ trước đã</span><span class="lz-t">docker image prune -a --filter "until=336h"</span><span class="lz-d">Gỡ những ảnh có tag cũ hơn hai tuần mà không container nào dùng. Tốn một lượt kéo lại, và trên máy chủ production nó có thể gỡ mất cái ảnh bạn định quay lui về.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Volume — NGUY HIỂM</span><span class="lz-t">docker volume ls -f dangling=true, rồi ĐỌC cái danh sách</span><span class="lz-d">Đừng bao giờ tỉa volume theo phản xạ. Hãy nhìn từng cái, xác nhận nó chứa gì, và sao lưu bất cứ thứ gì bạn không chắc. Đây là bước xoá mất cơ sở dữ liệu.</span></div>
</div>
<pre><code>docker builder prune -f
docker image prune -f
docker container prune -f
docker system df</code></pre>
<div class="out">Total reclaimed space: 11.03GB
Total reclaimed space: 5.41GB
Total reclaimed space: 198.3MB
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          19        4         13.01GB   9.52GB (73%)
Containers      3         3         43.4MB    0B (0%)
Local Volumes   9         2         6.114GB   4.882GB (79%)
Build Cache     0         0         0B        0B</div>

<p>Mỗi lệnh prune thật ra coi cái gì là "không dùng" — đây là chỗ người ta bị thương, nên đáng một cái bảng:</p>
<table>
<tr><th>Lệnh</th><th>Gỡ</th><th>Giữ</th></tr>
<tr><td><code>docker builder prune</code></td><td>bộ đệm dựng không thuộc lượt dựng nào đang chạy</td><td>không đụng thứ gì khác</td></tr>
<tr><td><code>docker image prune</code></td><td>CHỈ ảnh mồ côi (<code>&lt;none&gt;</code>)</td><td>mọi ảnh có tag</td></tr>
<tr><td><code>docker image prune -a</code></td><td>mọi ảnh không container <em>NÀO</em> dùng, có tag hay không</td><td>ảnh của container đang tồn tại (chạy hay đã dừng)</td></tr>
<tr><td><code>docker container prune</code></td><td>mọi container đã dừng (cùng log và tầng ghi của chúng)</td><td>container đang chạy</td></tr>
<tr><td><code>docker volume prune</code></td><td>volume <strong>VÔ DANH</strong> không container nào dùng</td><td>volume có tên (từ Docker Engine 23)</td></tr>
<tr><td><code>docker volume prune -a</code></td><td>mọi volume không dùng, kể cả có tên</td><td>volume đang gắn vào container nào đó</td></tr>
<tr><td><code>docker system prune</code></td><td>container đã dừng + mạng không dùng + ảnh mồ côi + bộ đệm dựng</td><td>volume (trừ khi có <code>--volumes</code>, thêm cả volume vô danh)</td></tr>
</table>
<p>Lệnh nào cũng nhận <code>--filter</code>, và đó là cách an toàn để tập: gắn nhãn cho những thứ bạn thử nghiệm và chỉ tỉa ĐÚNG nhãn đó. Khoá này làm đúng như vậy — mọi đối tượng nó tạo ra đều mang <code>--label dkhoc=03</code> (hoặc <code>LABEL dkhoc=03</code> trong Dockerfile), nên một lượt prune minh hoạ không bao giờ với tới hơn 60 volume khác đang nằm trên máy.</p>
<p>16,6GB từ ba câu lệnh không rủi ro. Đó là hình hài thường gặp: phần lớn thứ tích tụ lại là bộ đệm và tầng mồ côi, và dọn nó đi hoàn toàn không cần phán đoán gì.</p>

<h3>Bộ lọc, để bạn giữ lại thứ đáng giữ</h3>
${slide('dk-03', 26, 'prune -a xoá luôn bản bạn định quay lui về')}
<pre><code><span class="tok-comment"># Mọi thứ không dùng và cũ hơn một tuần, nhưng giữ lại thứ có nhãn bảo vệ</span>
docker image prune -a -f \\
  --filter "until=168h" \\
  --filter "label!=keep=true"

<span class="tok-comment"># Bộ đệm dựng cũ hơn 7 ngày, hoặc vượt một trần dung lượng</span>
docker builder prune -f --filter "until=168h"
docker builder prune -f --keep-storage 10GB

<span class="tok-comment"># Nhìn trước khi nhảy: KHÔNG có cờ --dry-run, nên hãy liệt kê trước</span>
docker images -a -f "until=168h" --format '{{.Repository}}:{{.Tag}} {{.Size}}'</code></pre>
<div class="out">Total reclaimed space: 3.88GB
Total reclaimed space: 0B
myapp:2026-08-01-9a8b7c6 1.79GB
node:20-alpine 178MB</div>
<div class="callout warn"><strong><code>docker system prune -a</code> trên máy chủ production xoá mất bản để quay lui của bạn.</strong> Cờ <code>-a</code> gỡ MỌI ảnh không được một container ĐANG CHẠY dùng — và điều đó bao gồm cả bản phát hành trước mà bạn sẽ triển khai lại nếu bản này hoá ra hỏng. Đột nhiên quay lui nghĩa là phải kéo từ registry, và điều đó ổn cho tới khi chính cái registry là thứ đang chết, hoặc mạng chậm, hoặc bạn đang làm chuyện này lúc 3 giờ sáng. Hãy ưu tiên <code>--filter "until=…"</code> với một cửa sổ dài hơn chân trời quay lui của bạn, và CỐ Ý giữ hai ba bản phát hành gần nhất trên máy.</div>


<p class="note-ct">CLI của Docker 29 đã đổi tên một cờ dùng ở trên: <code>docker builder prune --keep-storage 10GB</code> vẫn chạy nhưng in ra <code>Flag --keep-storage has been deprecated, keep-storage flag has been changed to reserved-space</code>. Các cờ mới là <code>--reserved-space</code> (luôn giữ lại chừng này bộ đệm), <code>--max-used-space</code> và <code>--min-free-space</code>.</p>
<h3>Chạy thử từng bước: nhìn -a lấy mất bản quay lui (an toàn, có nhãn)</h3>
<p>Ba bản phát hành của một ảnh web nhỏ được đẩy từ máy Mac và kéo về máy Linux đóng vai "máy chủ"; v3 đang chạy, v1 và v2 là những bản để quay lui. Mọi ảnh đều mang <code>LABEL dkhoc=03</code>, nên các lệnh prune dưới đây chỉ có thể nhìn thấy chúng:</p>
<pre><code class="language-bash">docker run -d --name web localhost:18030/dk03-web:v3 sleep 600
docker images --filter label=dkhoc=03 --format '{{.Repository}}:{{.Tag}} {{.ID}}'
docker image prune -f --filter label=dkhoc=03          <span class="tok-comment"># bậc 2 của cái thang</span>
docker image prune -a -f --filter label=dkhoc=03       <span class="tok-comment"># bậc 4 — xem cái gì ra đi</span>
docker images --filter label=dkhoc=03 --format '{{.Repository}}:{{.Tag}} {{.ID}}'</code></pre>
<div class="out">localhost:18030/dk03-web:v3 bbc911fc7624
localhost:18030/dk03-web:v2 782802ea637a
localhost:18030/dk03-web:v1 f934ee732cd4
…
untagged: localhost:18030/dk03-web:v1
untagged: localhost:18030/dk03-web:v2
…
Total reclaimed space: 14.6MB
localhost:18030/dk03-web:v3 bbc911fc7624</div>
<p>Lệnh prune thường chỉ tìm thấy hai ảnh <code>&lt;none&gt;</code> còn sót lại từ Bài 3.2 (thu hồi 17,6 kB — chúng dùng chung mọi tầng thật với các ảnh có tag). Lệnh prune <code>-a</code> gỡ v1 và v2 mà không hỏi một câu, vì không container nào dùng chúng. Nếu 3 giờ sáng v3 hoá ra hỏng, thì quay lui giờ là một lượt kéo từ registry — ổn khi registry còn sống và mạng nhanh, khổ sở trong mọi trường hợp khác. Hãy bảo vệ thứ bạn có thể cần:</p>
<pre><code class="language-bash"><span class="tok-comment"># giữ những ảnh trẻ hơn hai tuần</span>
docker image prune -a -f --filter "until=336h"
<span class="tok-comment"># hoặc đánh dấu các bản phát hành gần nhất lúc dựng rồi loại chúng ra</span>
docker build --label keep=true -t app:1.4.2 .
docker image prune -a -f --filter "label!=keep=true"</code></pre>
<h3>Volume xứng đáng một đoạn riêng</h3>
${slide('dk-03', 27, 'volume prune chỉ xoá volume vô danh — vẫn phải nhìn trước')}
<pre><code>docker volume ls -f dangling=true
docker volume inspect \$(docker volume ls -qf dangling=true | head -1) \\
  --format '{{.Name}} {{.Mountpoint}} {{.CreatedAt}}'
sudo du -sh /var/lib/docker/volumes/* 2&gt;/dev/null | sort -hr | head -5</code></pre>
<div class="out">DRIVER    VOLUME NAME
local     4f9a2c1e8b3d7f6a5c4b3a29180716f5e4d3c2b1a09f8e7d6c5b4a3928170615
local     pgdata_old
4f9a2c1e8b3d… /var/lib/docker/volumes/4f9a2c1e8b3d…/_data 2026-07-14T09:12:03Z
3.9G	/var/lib/docker/volumes/4f9a2c1e8b3d7f6a5c4b3a29180716f5e4d3c2b1a09f8e7d6c5b4a3928170615
1.1G	/var/lib/docker/volumes/pgdata
890M	/var/lib/docker/volumes/pgdata_old
<span class="tok-comment"># Cái 3,9G tên ngẫu nhiên kia là một volume vô danh — rất có thể là một cơ sở dữ liệu.</span></div>
<pre><code><span class="tok-comment"># Nhìn vào bên trong TRƯỚC KHI quyết định bất cứ điều gì</span>
sudo ls /var/lib/docker/volumes/4f9a2c1e8b3d…/_data | head -5
<span class="tok-comment"># Hoặc không cần root, qua một container:</span>
docker run --rm -v 4f9a2c1e8b3d…:/v alpine ls -la /v | head -5</code></pre>
<div class="out">PG_VERSION  base  global  pg_wal  postgresql.conf</div>
<p>Đó là một thư mục dữ liệu của PostgreSQL. Nó thành vô danh vì có người chạy <code>postgres</code> mà không có <code>-v</code>, Docker tôn trọng lời khai <code>VOLUME</code> của ảnh bằng một cái tên ngẫu nhiên, và cái container sau đó bị xoá (Bài 1.4). <code>docker volume prune</code> hẳn đã gỡ nó đi mà không hỏi han. Hãy ĐẶT TÊN cho volume của bạn; khi đó một danh sách sẽ đọc được và quyết định này không bao giờ phải đưa ra dưới áp lực.</p>


<h3>Chạy thử từng bước: tìm xem một volume vô danh chứa gì, không cần root</h3>
<p>Dựng lại trên máy Mac của khoá bằng một Postgres vứt đi chạy theo cách "sai" — không có <code>-v</code>:</p>
<pre><code class="language-bash">docker run -d --name pg -e POSTGRES_PASSWORD=x postgres:16-alpine; sleep 6
V=$(docker inspect pg --format '{{range .Mounts}}{{.Name}}{{end}}'); echo $V
docker rm -f pg                                   <span class="tok-comment"># container đi, volume ở lại</span>
docker volume inspect $V --format '{{.Name}} {{.CreatedAt}} {{json .Labels}}'
docker run --rm -v $V:/v:ro alpine:3.20 ls /v | head -8
docker run --rm -v $V:/v:ro alpine:3.20 cat /v/PG_VERSION
docker run --rm -v $V:/v:ro alpine:3.20 du -sh /v</code></pre>
<div class="out">daf727d8ac4ec07eb0304491b20e80028239163e1d2f3104fb51f1120183e513
daf727d8ac4ec07eb0304491b20e80028239163e1d2f3104fb51f1120183e513 2026-09-23T14:14:15Z {"com.docker.volume.anonymous":""}
PG_VERSION
base
global
pg_commit_ts
pg_dynshmem
pg_hba.conf
pg_ident.conf
pg_logical
16
38.3M	/v</div>
<table>
<tr><th>Manh mối</th><th>Nó cho bạn biết</th></tr>
<tr><td>tên 64 ký tự hex</td><td>không ai đặt tên — sinh ra từ dòng <code>VOLUME</code> của ảnh hoặc một <code>-v /đường-dẫn</code> trơn</td></tr>
<tr><td>nhãn <code>com.docker.volume.anonymous</code></td><td>chính Docker đánh dấu nó là vô danh — đây là thứ <code>docker volume prune</code> (không có <code>-a</code>) sẽ lấy đi</td></tr>
<tr><td><code>PG_VERSION</code>, <code>base</code>, <code>pg_wal</code></td><td>một thư mục dữ liệu PostgreSQL; <code>PG_VERSION</code> cho biết bản lớn nào (16)</td></tr>
<tr><td><code>:ro</code> khi gắn</td><td>bạn nhìn mà không có cơ hội nào làm thay đổi nó</td></tr>
</table>
<p>Rồi mới quyết định: sao lưu nó (<code>docker run --rm -v $V:/v:ro -v "$PWD":/out alpine:3.20 tar czf /out/pg-cu.tgz -C /v .</code>), gắn lại vào một Postgres mới (Bài 1.4), hoặc xoá theo tên bằng <code>docker volume rm $V</code> khi đã chắc chắn. Trên máy Mac, cùng lệnh liệt kê <code>docker volume ls -f dangling=true</code> cho thấy 46 volume không dùng của các dự án khác — và đó chính là lý do bạn soi <em>TỪNG CÁI theo tên</em> thay vì tỉa cả đống.</p>
<p class="note-ct">Cùng lần chạy đó cũng xác nhận luật có tên/vô danh trên Docker 29: <code>docker volume create --label dkhoc=03 dk03-named</code>, rồi <code>docker volume prune -f --filter label=dkhoc=03</code> in ra <code>Total reclaimed space: 0B</code> và để yên nó; chỉ <code>docker volume prune -a -f --filter label=dkhoc=03</code> mới in <code>Deleted Volumes: dk03-named</code>.</p>
<h3>Tự động hoá phần AN TOÀN</h3>
${slide('dk-03', 28, 'Tự động hoá phần an toàn, để phần nguy hiểm cho người')}
<pre><code><span class="tok-comment"># /etc/systemd/system/docker-prune.service</span>
[Unit]
Description=Reclaim Docker build cache and dangling images

[Service]
Type=oneshot
ExecStart=/usr/bin/docker builder prune -f --filter until=168h
ExecStart=/usr/bin/docker image prune -f
ExecStart=/usr/bin/docker container prune -f --filter until=168h</code></pre>
<pre><code><span class="tok-comment"># /etc/systemd/system/docker-prune.timer</span>
[Unit]
Description=Weekly Docker cleanup

[Timer]
OnCalendar=Sun 04:00
Persistent=true
RandomizedDelaySec=1800

[Install]
WantedBy=timers.target</code></pre>
<pre><code>sudo systemctl daemon-reload
sudo systemctl enable --now docker-prune.timer
systemctl list-timers docker-prune.timer --no-pager</code></pre>
<div class="out">NEXT                        LEFT      LAST  PASSED  UNIT                ACTIVATES
Sun 2026-08-24 04:00:00 UTC 1 day 6h  -     -       docker-prune.timer  docker-prune.service</div>
<div class="callout ok"><strong>Hãy để ý thứ <em>KHÔNG</em> có trong cái timer đó: <code>-a</code> và <code>--volumes</code>.</strong> Dọn dẹp tự động chỉ nên làm những thao tác KHÔNG THỂ làm mất thứ gì — bộ đệm dựng, ảnh mồ côi, container đã dừng từ lâu. Bất cứ thứ gì cần phán đoán thì để thủ công, vì một công việc cron không nhìn vào một cái volume rồi quyết được nó có phải cơ sở dữ liệu hay không. Đây cũng là phòng thủ tốt nhất chống lại cú sự cố đĩa-đầy-lúc-3-giờ-sáng, và nó tốn đúng một cái file.</div>
<p>Còn một lựa chọn "lười" hơn nữa cho bộ đệm dựng: để tiến trình Docker tự đặt trần cho nó. Đây là ví dụ trong tài liệu thu gom rác của Docker — đặt vào <code>/etc/docker/daemon.json</code> trên Linux, hoặc Docker Desktop → Settings → Docker Engine:</p>
<pre><code class="language-json">{
  "builder": {
    "gc": {
      "enabled": true,
      "defaultKeepStorage": "20GB"
    }
  }
}</code></pre>
<p>Với cấu hình đó, BuildKit tự cắt bộ đệm của nó về khoảng 20 GB ở chế độ nền — không có cái timer nào để quên. Đổi <code>daemon.json</code> cần nạp lại hoặc khởi động lại tiến trình Docker, và trên máy chủ production đó là lúc phải lên kế hoạch (<code>live-restore</code> ở Chương 1); trên Docker Desktop, "Apply &amp; restart" khởi động lại máy ảo và mọi container bên trong.</p>



<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tuần trước buổi demo SWP391, Docker Desktop trên máy Mac báo ổ đĩa ảo gần đầy, và một bạn cùng nhóm gợi ý <code>docker system prune -a --volumes</code>. Bạn muốn lấy lại chỗ trống mà KHÔNG mất CSDL cục bộ của nhóm hay bất cứ thứ gì phải làm lại.</p><ol>
<li>Đo: chạy <code>docker system df</code> và ghi bốn con số SIZE và RECLAIMABLE vào <code>~/thu-docker/dia.txt</code>.</li>
<li>Tập trước trên đối tượng có nhãn của chính mình: dựng một ảnh nhỏ bất kỳ hai lần với <code>--label thu=1</code>, tạo một volume với <code>--label thu=1</code>, rồi chạy từng lệnh prune với <code>--filter label=thu=1</code> và đoán TRƯỚC mỗi lệnh xem cái gì sẽ biến mất.</li>
<li>Leo cái thang thật, chỉ tới bậc 2: <code>docker builder prune -f</code>, rồi <code>docker image prune -f</code>. Ghi lại các dòng "Total reclaimed space".</li>
<li>Liệt kê (không xoá) <code>docker volume ls -f dangling=true</code>; chọn một cái tên và nhìn vào bên trong ở chế độ chỉ đọc như mục chạy thử ở trên.</li>
<li>Chạy lại <code>docker system df</code> và ghi con số mới ngay dưới con số cũ.</li></ol>
<p><strong>Đạt khi:</strong> <code>dia.txt</code> có số trước/sau, dòng Build Cache đã giảm, mọi dự đoán ở bước 2 khớp với thực tế, và không volume nào bị xoá ngoài cái bạn tự gắn nhãn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">docker system df (báo cáo dung lượng)</span><span class="v">Báo cáo chỉ-đọc về dung lượng đĩa của ảnh, container, volume và bộ đệm dựng.</span></div>
  <div class="kv"><span class="k">Reclaimable (thu hồi được)</span><span class="v">Chỗ trống có thể giải phóng mà không đụng thứ đang dùng — một ước lượng, không phải lời hứa.</span></div>
  <div class="kv"><span class="k">Build cache (bộ đệm dựng)</span><span class="v">Kết quả trung gian BuildKit cất lại; xoá an toàn, chỉ làm lượt dựng sau chậm hơn.</span></div>
  <div class="kv"><span class="k">Prune (tỉa)</span><span class="v">Nhóm lệnh "xoá mọi thứ không dùng thuộc loại này"; mỗi lệnh hiểu "không dùng" theo một kiểu.</span></div>
  <div class="kv"><span class="k">Filter — until / label (bộ lọc)</span><span class="v">Giới hạn một lượt prune vào đối tượng cũ hơn một mốc thời gian, hoặc có (hay không có) một nhãn.</span></div>
  <div class="kv"><span class="k">Rollback image (ảnh để quay lui)</span><span class="v">Bản phát hành trước được giữ trên máy chủ để chuyển về trong vài giây.</span></div>
  <div class="kv"><span class="k">Anonymous volume (volume vô danh)</span><span class="v">Volume tên ngẫu nhiên, mang nhãn <code>com.docker.volume.anonymous</code>; loại duy nhất mà volume prune thường gỡ đi.</span></div>
  <div class="kv"><span class="k">Builder GC (dọn rác bộ đệm dựng)</span><span class="v"><code>builder.gc</code> trong <code>daemon.json</code>: tiến trình Docker giữ bộ đệm dựng dưới một trần bạn chọn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Docker không tự xoá gì; <code>docker system df</code> là bước đầu tiên, chỉ đọc.</li>
<li>Bộ đệm dựng và ảnh mồ côi là những bậc an toàn đầu tiên — và thường chiếm phần lớn dung lượng.</li>
<li><code>-a</code> gỡ mọi ảnh không container nào dùng, mà trên máy chủ nghĩa là bản để quay lui của bạn.</li>
<li><code>volume prune</code> thường chỉ lấy volume vô danh — mà đó đúng là chỗ một CSDL bị lãng quên đang nằm; hãy nhìn vào trước.</li>
<li>Tập và tự động hoá bằng <code>--filter</code> (<code>until=</code>, <code>label=</code>); đừng bao giờ tự động hoá <code>-a</code> hay <code>--volumes</code>.</li>
<li>Đặt trần cho bộ đệm dựng bằng <code>builder.gc</code>, và đừng dựng ảnh trên chính cái máy đang giữ CSDL.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/manage-resources/pruning/" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">Tỉa những đối tượng Docker không dùng</span><span class="lc-sub">Mọi lệnh con prune, chính xác từng cái coi thứ gì là "không dùng", và cú pháp bộ lọc đầy đủ. Hãy đọc phần volume HAI LẦN trước khi chạy nó ở bất cứ đâu có thật.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/system/df/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">docker system df</span><span class="lc-sub">Gồm cả <code>-v</code>, cái này chẻ nhỏ các con số tổng theo từng ảnh, từng container và từng volume — góc nhìn cho bạn biết XOÁ CÁI GÌ chứ không chỉ là có bao nhiêu.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/cache/garbage-collection/" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">Thu gom rác cho bộ đệm BuildKit</span><span class="lc-sub">Cấu hình giới hạn bộ đệm tự động trong <code>/etc/docker/daemon.json</code> để bộ đệm dựng không bao giờ vượt một cái trần do bạn chọn — tốt hơn việc nhớ đi tỉa.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: thu hồi lại cái đĩa</span><span class="lc-sub">Bài chấm điểm: đọc <code>docker system df</code> rồi nói nên dọn cái gì trước, xác định nội dung một volume vô danh mà không cần root, viết một bộ lọc prune giữ lại hai bản phát hành gần nhất, và giải thích <code>system prune -a</code> hẳn đã lấy đi cái gì.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>docker system prune -a --volumes</code> như một phản xạ khi đĩa đầy. Nó gỡ mọi ảnh không dùng, mọi container đã dừng, mọi mạng — và <strong>MỌI VOLUME VÔ DANH không gắn vào container nào</strong> (từ Docker Engine 23, volume có tên được bỏ qua trừ khi bạn dùng thêm <code>docker volume prune -a</code> — các bản cũ hơn lấy cả volume có tên). Nếu volume CSDL của bạn là vô danh — mặc định khi Postgres chạy thiếu <code>-v</code> — và container của nó đã bị xoá, thì dữ liệu biến mất, không có xác nhận nào ngoài một câu <code>y/N</code> chung chung chẳng gọi tên thứ nó sắp xoá. Không có hoàn tác. Hãy chạy cái thang ở trên theo thứ tự, đừng bao giờ thêm <code>--volumes</code> vào một công việc tự động, và hãy sao lưu trước mọi lần dọn dẹp trên một cái máy giữ dữ liệu bạn không tạo lại được.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Bộ đệm dựng và ảnh mồ côi thường là phần lớn vấn đề và xoá chúng không rủi ro, nên <code>docker builder prune</code> với <code>docker image prune</code> đi trước, luôn luôn. <code>-a</code> gỡ những ảnh không container ĐANG CHẠY nào dùng, mà trên máy chủ thì điều đó bao gồm cả bản phát hành bạn định quay lui về — hãy dùng <code>--filter until=</code> với một cửa sổ rộng hơn chân trời quay lui. Và ĐỪNG BAO GIỜ tự động hoá việc tỉa volume: hãy đặt tên cho volume, nhìn vào bên trong trước khi xoá, và nhớ rằng một volume vô danh mang tên ngẫu nhiên rất thường là cơ sở dữ liệu của một ai đó.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.6 ─────────────────────────── */
    {
      title: '3.6 — Quiz: images & registries|||3.6 — Kiểm tra: image & registry',
      slug: 'dk-3-6-quiz',
      type: 'QUIZ',
      description: 'Mười tình huống thật: tên không có dấu chấm đi về Docker Hub, postgres:latest lên 18 và đổi PGDATA, ảnh <none> sau mỗi lần deploy, digest chỉ mục hay digest nền tảng, Mounted from, config.json base64, toomanyrequests, exec format error, --load đa nền tảng trên Docker 29, và dọn đĩa VPS an toàn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from real deploys — several of them reproduced on the course machines while this chapter was written. Read the explanation after submitting, especially for the questions you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can expand any short image name to <code>registry/namespace/repository:tag</code> and say why <code>myregistry/app</code> goes to Docker Hub.</li>
<li>I can read an index with <code>docker buildx imagetools inspect</code> and tell the index digest from a platform digest.</li>
<li>I can explain where <code>&lt;none&gt;</code> images come from and why <code>postgres:latest</code> is a time bomb in a Compose file.</li>
<li>I can run a local <code>registry:2</code>, push to it, and explain <code>Mounted from</code> and the base64 in <code>config.json</code>.</li>
<li>I can diagnose <code>no matching manifest</code> and <code>exec format error</code>, and build one image for amd64 and arm64.</li>
<li>I can free disk space with the safe rungs of the ladder and say what <code>-a</code> and <code>--volumes</code> would have cost.</li>
</ul>
${slide('dk-03', 30, 'Bảng tra nhanh Chương 3')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ những lần deploy thật — vài cái đã được dựng lại ngay trên máy của khoá trong lúc viết chương này. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi khai triển được mọi tên ảnh ngắn thành <code>registry/không-gian-tên/kho:tag</code> và nói được vì sao <code>myregistry/app</code> lại đi tới Docker Hub.</li>
<li>Tôi đọc được một chỉ mục bằng <code>docker buildx imagetools inspect</code> và phân biệt được digest chỉ mục với digest nền tảng.</li>
<li>Tôi giải thích được ảnh <code>&lt;none&gt;</code> từ đâu ra và vì sao <code>postgres:latest</code> trong file Compose là một quả bom hẹn giờ.</li>
<li>Tôi chạy được một <code>registry:2</code> cục bộ, đẩy lên nó, và giải thích được <code>Mounted from</code> cùng chuỗi base64 trong <code>config.json</code>.</li>
<li>Tôi chẩn đoán được <code>no matching manifest</code> và <code>exec format error</code>, và dựng được một ảnh cho cả amd64 lẫn arm64.</li>
<li>Tôi giải phóng được đĩa bằng các bậc an toàn của cái thang và nói được <code>-a</code> với <code>--volumes</code> hẳn đã lấy đi những gì.</li>
</ul>
${slide('dk-03', 30, 'Bảng tra nhanh Chương 3')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Your team runs a registry on a lab machine whose hostname is myregistry (port 5000). You tag your API as myregistry/api:1.0 and push. The push fails with "push access denied … insufficient_scope". What is going on?|||Nhóm bạn chạy một registry trên máy phòng lab có hostname là myregistry (cổng 5000). Bạn gắn tag API thành myregistry/api:1.0 rồi push. Lượt push hỏng với "push access denied … insufficient_scope". Chuyện gì đang xảy ra?',
            options: [
              'The lab registry needs docker login first; log in to myregistry and push again|||Registry phòng lab cần docker login trước; đăng nhập vào myregistry rồi push lại',
              'Without a dot, a colon or "localhost", myregistry is read as a Docker Hub account — the push went to docker.io; tag it myregistry:5000/api:1.0|||Không có dấu chấm, dấu hai chấm hay "localhost" thì myregistry bị hiểu là tài khoản Docker Hub — lượt push đã đi tới docker.io; hãy gắn tag myregistry:5000/api:1.0',
              'Registries only accept names with at least three path components, such as myregistry/team/api|||Registry chỉ nhận tên có ít nhất ba thành phần đường dẫn, kiểu myregistry/team/api',
              'The image has no digest yet; run docker image inspect to generate one before pushing|||Ảnh chưa có digest; chạy docker image inspect để sinh ra một cái trước khi push',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Docker treats the first component as a registry only if it contains "." or ":" or is exactly "localhost". "myregistry" has none, so the reference expands to docker.io/myregistry/api:1.0 and Hub refuses because you do not own that account. Logging in (the tempting answer) would only log you in to Docker Hub — the request never reached the lab machine.|||VI: Docker chỉ coi thành phần đầu là registry khi nó chứa "." hoặc ":" hoặc đúng bằng "localhost". "myregistry" chẳng có gì, nên tham chiếu khai triển thành docker.io/myregistry/api:1.0 và Hub từ chối vì bạn không sở hữu tài khoản đó. Đăng nhập (phương án hấp dẫn) chỉ đăng nhập bạn vào Docker Hub — yêu cầu chưa từng tới máy phòng lab.',
          },
          {
            question: 'A teammate clones the project on a new laptop. compose.yaml says image: postgres:latest with a volume at /var/lib/postgresql/data. The db container exits with "Error: in 18+, these Docker images are configured to store database data in a format … there appears to be PostgreSQL data in /var/lib/postgresql/data". What is the right fix?|||Một bạn cùng nhóm clone dự án về laptop mới. compose.yaml ghi image: postgres:latest với volume ở /var/lib/postgresql/data. Container db thoát với "Error: in 18+, these Docker images are configured to store database data in a format … there appears to be PostgreSQL data in /var/lib/postgresql/data". Cách sửa đúng là gì?',
            options: [
              'Delete the volume so Postgres 18 can initialise a fresh database|||Xoá volume đi để Postgres 18 khởi tạo một CSDL mới tinh',
              'Run docker compose pull again; the image was only partially downloaded|||Chạy lại docker compose pull; ảnh mới chỉ được tải về một phần',
              'Change the mount to /var/lib/postgresql/18/docker so the new image finds the old files|||Đổi điểm gắn sang /var/lib/postgresql/18/docker để ảnh mới tìm thấy file cũ',
              'latest moved to 18, which also changed PGDATA; pin the major you actually run (postgres:16-alpine) and upgrade on purpose later|||latest đã dời sang 18, bản này còn đổi cả PGDATA; ghim bản lớn bạn thật sự đang chạy (postgres:16-alpine) và nâng cấp có chủ ý sau',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: A tag is a moving pointer: on 23/09/2026 postgres:latest was 18.6 with PGDATA=/var/lib/postgresql/18/docker. The image refuses to start rather than touch 16-format data. Moving the mount (the tempting option) points a version-18 server at version-16 files, which it cannot read; deleting the volume destroys the data. Pin the major, upgrade with pg_upgrade or dump/restore when you choose.|||VI: Tag là con trỏ dịch chuyển: ngày 23/09/2026 postgres:latest là 18.6 với PGDATA=/var/lib/postgresql/18/docker. Ảnh từ chối khởi động chứ không đụng vào dữ liệu định dạng 16. Dời điểm gắn (phương án hấp dẫn) là chĩa một máy chủ bản 18 vào file bản 16 mà nó không đọc được; xoá volume là huỷ dữ liệu. Hãy ghim bản lớn, nâng cấp bằng pg_upgrade hoặc dump/restore khi bạn chọn.',
          },
          {
            question: 'Your VPS deploys by running docker compose pull && docker compose up -d with image: ghcr.io/you/api:latest. After a month, docker images shows dozens of <none>:<none> entries. Why, and what is the safe first action?|||VPS của bạn deploy bằng docker compose pull && docker compose up -d với image: ghcr.io/you/api:latest. Sau một tháng, docker images hiện hàng chục dòng <none>:<none>. Vì sao, và việc an toàn đầu tiên là gì?',
            options: [
              'Each pull moves :latest to the new image and leaves the previous one nameless (dangling); docker image prune -f removes only those|||Mỗi lượt kéo dời :latest sang ảnh mới và bỏ lại ảnh trước không tên (mồ côi); docker image prune -f chỉ gỡ đúng những cái đó',
              'Compose keeps a <none> backup of every image for rollback; they must stay until you run compose down|||Compose giữ một bản sao <none> của mọi ảnh để quay lui; chúng phải ở lại tới khi bạn chạy compose down',
              'The layers were corrupted during the pull; run docker system prune -a --volumes to rebuild the store|||Các tầng bị hỏng lúc kéo; chạy docker system prune -a --volumes để dựng lại kho',
              'GHCR images are always stored without tags; add --tag-local to the pull command|||Ảnh GHCR luôn được lưu không có tag; thêm --tag-local vào lệnh kéo',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: The course reproduced exactly this: after the second pull of a moved tag, the old image showed as <none>:<none> and the old container kept only its ID. image prune without -a removes only dangling images, so nothing with a name is touched. system prune -a --volumes (the dramatic option) also deletes rollback images and anonymous volumes — it is never a first action.|||VI: Khoá đã dựng lại đúng cảnh này: sau lượt kéo thứ hai của một tag đã dời, ảnh cũ hiện thành <none>:<none> và container cũ chỉ còn lại ID. image prune không có -a chỉ gỡ ảnh mồ côi, nên không gì có tên bị đụng tới. system prune -a --volumes (phương án kịch tính) còn xoá cả ảnh để quay lui và volume vô danh — không bao giờ là việc đầu tiên.',
          },
          {
            question: 'You want compose.yaml to pin nginx by digest so the same file works on your M1 Mac and on the amd64 VPS. Which digest do you paste?|||Bạn muốn compose.yaml ghim nginx bằng digest để cùng một file chạy được trên máy Mac M1 lẫn VPS amd64. Bạn dán digest nào?',
            options: [
              'The digest of the linux/arm64 entry in the Manifests: list, because the Mac is where you test|||Digest của mục linux/arm64 trong danh sách Manifests:, vì máy Mac là nơi bạn thử',
              'The digest of the linux/amd64 entry, because production matters most|||Digest của mục linux/amd64, vì production quan trọng nhất',
              'The index digest on the Digest: line of imagetools inspect (the same value as RepoDigests)|||Digest chỉ mục ở dòng Digest: của imagetools inspect (cùng giá trị với RepoDigests)',
              'The first 12 characters of IMAGE ID from docker images on the Mac|||12 ký tự đầu của IMAGE ID trong docker images trên máy Mac',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: The index digest still resolves per platform, so each machine picks its own entry. A platform digest forces that architecture everywhere: on the course Linux box, running dk03-multi@<arm64 digest> ended in "exec /bin/sh: exec format error". The 12-character ID is a shortened digest — compose needs the full 64 characters after sha256:.|||VI: Digest chỉ mục vẫn phân giải theo từng nền tảng, nên mỗi máy tự chọn mục của mình. Digest nền tảng ép kiến trúc đó lên mọi máy: trên máy Linux của khoá, chạy dk03-multi@<digest arm64> kết thúc bằng "exec /bin/sh: exec format error". ID 12 ký tự là digest rút gọn — compose cần đủ 64 ký tự sau sha256:.',
          },
          {
            question: 'Pushing your API image to your own registry, one line reads "3f26bc2dec0b: Mounted from goc/alpine". What does it mean?|||Khi đẩy ảnh API lên registry của chính bạn, một dòng ghi "3f26bc2dec0b: Mounted from goc/alpine". Nó nghĩa là gì?',
            options: [
              'The push failed for that layer and the registry fell back to a read-only mount|||Lượt đẩy tầng đó hỏng và registry lùi về một lần mount chỉ-đọc',
              'The registry already had that exact layer in another repository, so it linked it instead of receiving the bytes again|||Registry đã có đúng tầng đó ở một kho khác, nên nó liên kết sang thay vì nhận lại các byte',
              'Your image is now permanently tied to goc/alpine and breaks if that repository is deleted by the owner|||Ảnh của bạn giờ bị gắn chặt vĩnh viễn với goc/alpine và sẽ hỏng nếu chủ kho đó xoá nó',
              'The layer was bind-mounted from your laptop into the registry container through the network|||Tầng đó được bind-mount từ laptop của bạn vào container registry qua mạng',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Layers are content-addressed blobs. Before uploading, the client asks whether the registry has sha256:…; if it exists in another repository it asks for a cross-repository mount — zero bytes sent. It is not a dependency in the Unix sense: the blob is shared storage, not a link that breaks when a tag is deleted.|||VI: Tầng là các blob định danh theo nội dung. Trước khi tải lên, máy khách hỏi registry đã có sha256:… chưa; nếu nó có ở kho khác thì máy khách xin gắn chéo — 0 byte được gửi. Đó không phải là một sự phụ thuộc kiểu liên kết dễ gãy: blob là vùng lưu dùng chung, không phải một đường dẫn sẽ hỏng khi ai đó xoá một cái tag.',
          },
          {
            question: 'On a Linux server shared by your group, ~/.docker/config.json contains "auth": "Y3Vvbmc6bWF0a2hhdTEyMw==". A classmate says it is encrypted, so it is fine. What is true?|||Trên một máy chủ Linux dùng chung của nhóm, ~/.docker/config.json chứa "auth": "Y3Vvbmc6bWF0a2hhdTEyMw==". Một bạn nói nó đã được mã hoá nên không sao. Điều gì mới đúng?',
            options: [
              'It is only base64 of "user:password" — anyone who can read the file has the credential; revoke it, use access tokens, a credential helper and docker logout|||Nó chỉ là base64 của "user:mật-khẩu" — ai đọc được file là có thông tin đăng nhập; hãy thu hồi nó, dùng access token, một credential helper và docker logout',
              'It is a one-way hash; the registry compares hashes, so the real password cannot be recovered from it|||Đó là một hàm băm một chiều; registry so sánh mã băm, nên không lấy lại được mật khẩu thật từ nó',
              'It is encrypted with the machine’s SSH host key and can only be used on this server|||Nó được mã hoá bằng khoá SSH của máy và chỉ dùng được trên máy chủ này',
              'It expires automatically after 24 hours, so there is nothing to do|||Nó tự hết hạn sau 24 giờ, nên không cần làm gì',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: echo Y3Vvbmc6bWF0a2hhdTEyMw== | base64 -d prints cuong:matkhau123 — the course did exactly that, and Docker itself printed "WARNING! Your credentials are stored unencrypted". The hash answer sounds plausible because htpasswd on the registry side IS a bcrypt hash — but the client file must hold the real secret to send it.|||VI: echo Y3Vvbmc6bWF0a2hhdTEyMw== | base64 -d in ra cuong:matkhau123 — khoá đã làm đúng như vậy, và chính Docker in "WARNING! Your credentials are stored unencrypted". Phương án hàm băm nghe hợp lý vì htpasswd phía registry ĐÚNG là băm bcrypt — nhưng file phía máy khách phải giữ bí mật thật để còn gửi đi.',
          },
          {
            question: 'CI jobs on the school network start failing with "toomanyrequests: You have reached your pull rate limit". The ratelimit header shows 100;w=3600. What is the best first fix?|||Các job CI trên mạng của trường bắt đầu hỏng với "toomanyrequests: You have reached your pull rate limit". Header ratelimit hiện 100;w=3600. Cách sửa đầu tiên tốt nhất là gì?',
            options: [
              'Add --pull=always everywhere so each job gets a fresh copy|||Thêm --pull=always ở mọi chỗ để mỗi job có một bản mới',
              'Switch every image to :latest, which is cached by Docker Hub and not counted|||Đổi mọi ảnh sang :latest, thứ được Docker Hub lưu đệm và không bị tính',
              'Retry in a loop; the limit resets a few seconds after the first failure|||Thử lại trong vòng lặp; giới hạn đặt lại vài giây sau lần hỏng đầu',
              'docker login in CI: anonymous pulls share one quota per IP (the whole school NAT); logged-in pulls count against your account|||docker login trong CI: lượt kéo ẩn danh chia chung một hạn mức theo IP (cả NAT của trường); kéo có đăng nhập thì tính vào tài khoản của bạn',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Anonymous pulls are counted per IPv4 address (or IPv6 /64) — behind a school or office NAT everybody shares it. w=3600 means a one-hour window, so retrying seconds later does nothing. --pull=always makes it worse. After logging in, a mirror (registry:2 in proxy mode) and moving your own images to GHCR reduce the count further.|||VI: Lượt kéo ẩn danh bị đếm theo địa chỉ IPv4 (hoặc dải IPv6 /64) — sau NAT của trường hay văn phòng thì mọi người dùng chung. w=3600 là cửa sổ một giờ, nên thử lại sau vài giây chẳng được gì. --pull=always còn làm tệ hơn. Sau khi đăng nhập, một cái gương (registry:2 chế độ proxy) và việc đưa ảnh của mình sang GHCR giảm số lượt thêm nữa.',
          },
          {
            question: 'You copied your M1-built API to the amd64 VPS with docker save | ssh vps docker load. The container restarts forever; its log shows "WARNING: The requested image’s platform (linux/arm64) does not match the detected host platform (linux/amd64/v3)" then "exec /usr/local/bin/node: exec format error". Fix?|||Bạn chép API dựng trên M1 sang VPS amd64 bằng docker save | ssh vps docker load. Container khởi động lại mãi; log hiện "WARNING: The requested image’s platform (linux/arm64) does not match the detected host platform (linux/amd64/v3)" rồi "exec /usr/local/bin/node: exec format error". Sửa thế nào?',
            options: [
              'Add #!/bin/sh to the entrypoint script and fix CRLF line endings|||Thêm #!/bin/sh vào script entrypoint và sửa kiểu xuống dòng CRLF',
              'Run chmod +x on /usr/local/bin/node inside the image and rebuild|||Chạy chmod +x cho /usr/local/bin/node trong ảnh rồi dựng lại',
              'Build for the server’s CPU: docker buildx build --platform linux/amd64,linux/arm64 (or linux/amd64) and ship that image|||Dựng cho CPU của máy chủ: docker buildx build --platform linux/amd64,linux/arm64 (hoặc linux/amd64) rồi gửi ảnh đó',
              'Increase the container’s memory limit; exec format error is how the kernel reports an out-of-memory start|||Tăng giới hạn bộ nhớ của container; exec format error là cách nhân báo một lần khởi động hết bộ nhớ',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: The WARNING line and the path (/usr/local/bin/node is a real binary) both say architecture: an arm64 image on an amd64 kernel with no emulator. The shebang option is tempting because a script without #! also gives "exec format error" — but then the path is your script and there is no platform WARNING. save/load skips the index check that would have refused it at pull time.|||VI: Dòng WARNING và đường dẫn (/usr/local/bin/node là chương trình thật) đều chỉ về kiến trúc: ảnh arm64 trên nhân amd64 không có bộ mô phỏng. Phương án shebang hấp dẫn vì script thiếu #! cũng báo "exec format error" — nhưng khi đó đường dẫn là script của bạn và không có dòng WARNING về nền tảng. save/load bỏ qua bước tra chỉ mục vốn sẽ từ chối nó ngay lúc kéo.',
          },
          {
            question: 'On Docker Desktop (Docker 29) you run docker buildx build --platform linux/amd64,linux/arm64 -t app:1 --load . A teammate insists it must fail and you need a docker-container builder with --push. Who is right?|||Trên Docker Desktop (Docker 29) bạn chạy docker buildx build --platform linux/amd64,linux/arm64 -t app:1 --load . Một bạn khẳng định lệnh đó chắc chắn hỏng và bạn cần builder docker-container cùng --push. Ai đúng?',
            options: [
              'You: the containerd image store (driver-type io.containerd.snapshotter.v1) holds whole indexes, so --load works with the default builder; the old rule applies to the classic overlay2 store|||Bạn: kho ảnh containerd (driver-type io.containerd.snapshotter.v1) giữ được cả chỉ mục, nên --load chạy với builder mặc định; luật cũ áp cho kho overlay2 cổ điển',
              'The teammate: local image stores can never hold more than one platform per tag|||Bạn kia: kho ảnh cục bộ không bao giờ giữ được quá một nền tảng cho mỗi tag',
              'Neither: multi-platform builds require a paid Docker subscription|||Không ai: dựng đa nền tảng cần gói Docker trả phí',
              'Both: it works, but only the arm64 image is kept and amd64 is silently dropped|||Cả hai: nó chạy, nhưng chỉ ảnh arm64 được giữ còn amd64 bị bỏ đi âm thầm',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured on the course Mac: the build printed "exporting manifest list … unpacking to docker.io/library/dk03-multi:1", and docker image ls --tree showed both linux/amd64 and linux/arm64 under one tag; each ran with --platform. Docker’s docs: Desktop and Engine 29+ use the containerd store by default. A machine upgraded from an older Engine may still be on overlay2 — check docker info first.|||VI: Đo trên máy Mac của khoá: lượt dựng in "exporting manifest list … unpacking to docker.io/library/dk03-multi:1", và docker image ls --tree cho thấy cả linux/amd64 lẫn linux/arm64 dưới một tag; mỗi cái đều chạy được với --platform. Tài liệu Docker: Desktop và Engine 29+ mặc định dùng kho containerd. Máy nâng cấp từ Engine cũ có thể vẫn ở overlay2 — kiểm docker info trước.',
          },
          {
            question: 'The VPS disk is at 95% and PostgreSQL runs on it. docker system df shows Build Cache 7.6GB and many <none> images. What do you run first?|||Đĩa VPS đã 95% và PostgreSQL đang chạy trên nó. docker system df cho thấy Build Cache 7.6GB và nhiều ảnh <none>. Bạn chạy gì trước?',
            options: [
              'docker system prune -a --volumes -f, which frees the most space in one go|||docker system prune -a --volumes -f, thứ giải phóng nhiều nhất trong một lần',
              'docker builder prune -f, then docker image prune -f — both zero-risk; then measure again before going further|||docker builder prune -f, rồi docker image prune -f — cả hai không rủi ro; rồi đo lại trước khi đi tiếp',
              'docker volume prune -a -f, because volumes are usually the biggest item|||docker volume prune -a -f, vì volume thường là thứ lớn nhất',
              'Stop PostgreSQL first, then docker image prune -a -f so its image can be cleaned too|||Dừng PostgreSQL trước, rồi docker image prune -a -f để dọn luôn ảnh của nó',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Build cache and dangling images are the safe rungs and usually most of the space. system prune -a --volumes also removes rollback images and anonymous volumes; volume prune -a deletes named ones too — possibly the database; stopping Postgres takes the site down for nothing, since a stopped container still holds its image and prune -a would not even free it. Climb the ladder one rung at a time and re-measure.|||VI: Bộ đệm dựng và ảnh mồ côi là những bậc an toàn, và thường chiếm phần lớn dung lượng. system prune -a --volumes còn xoá ảnh để quay lui và volume vô danh; volume prune -a xoá cả volume có tên — có thể chính là CSDL; dừng Postgres là làm sập trang vô ích, vì container đã dừng vẫn giữ ảnh của nó và prune -a còn chẳng gỡ được. Hãy leo từng bậc một và đo lại.',
          },
        ],
      },
    },
  ],
};
