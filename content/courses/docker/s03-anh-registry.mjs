/**
 * Docker — Chương 3: image & registry.
 * Tên ảnh · tag với digest · registry · đa kiến trúc · quản lý đĩa · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 3 — Images & registries|||Chương 3 — Image & registry',
  description: 'Một cái tên ảnh gồm bốn phần và phần nào cũng quan trọng. Tag di chuyển còn digest thì không. Registry nào, giới hạn tần suất ra sao, ảnh đa kiến trúc, và làm sao để /var/lib/docker không nuốt cả cái đĩa.',
  lessons: [
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
<pre><code><span class="tok-comment"># The full form, with nothing left out:</span>
docker.io/library/nginx:1.27-alpine
<span class="tok-comment"># ^^^^^^^^ ^^^^^^^ ^^^^^ ^^^^^^^^^^^</span>
<span class="tok-comment"># registry namespace repo  tag</span>

docker pull nginx:1.27-alpine
docker image inspect nginx:1.27-alpine --format '{{index .RepoTags 0}}'
docker image inspect nginx:1.27-alpine --format '{{index .RepoDigests 0}}'</code></pre>
<div class="out">nginx:1.27-alpine
nginx@sha256:41523187cf7d7a2f2677a80609d9caa14388bf5c1fbca9c410ba3de602aaaab4</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">registry — defaults to docker.io</span><span class="lz-lnote">The host serving the image. <code>ghcr.io</code>, <code>quay.io</code>, <code>registry.gitlab.com</code>, <code>123456.dkr.ecr.ap-southeast-1.amazonaws.com</code>, or your own. Docker recognises it because it contains a dot or a colon, or is exactly <code>localhost</code> — which is why <code>myregistry/app</code> without a dot is treated as a Docker Hub <em>namespace</em>, not a host.</span></div>
  <div class="lz-layer"><span class="lz-lname">namespace — defaults to library</span><span class="lz-lnote">The account or organisation. <code>library</code> is Docker's own namespace for curated official images, and it is the only one you never have to type. <code>bitnami/postgresql</code>, <code>cuonghoang1103/api</code> — those are user namespaces.</span></div>
  <div class="lz-layer"><span class="lz-lname">repository — the only mandatory part</span><span class="lz-lnote">The name of the thing: <code>nginx</code>, <code>postgres</code>, <code>node</code>. One repository holds many tags and many architectures.</span></div>
  <div class="lz-layer"><span class="lz-lname">tag — defaults to latest</span><span class="lz-lnote">A human label pointing at one image. It is a <strong>mutable pointer</strong>, not a version — Lesson 3.2 is about why that matters more than anything else in this chapter.</span></div>
  <div class="lz-layer"><span class="lz-lname">or @digest — instead of a tag</span><span class="lz-lnote"><code>nginx@sha256:4152…</code> names the content itself. Immutable by construction: that string can only ever refer to those exact bytes.</span></div>
</div>
<pre><code><span class="tok-comment"># All four of these pull the same image</span>
docker pull nginx:1.27-alpine
docker pull library/nginx:1.27-alpine
docker pull docker.io/nginx:1.27-alpine
docker pull docker.io/library/nginx:1.27-alpine
docker images nginx --format '{{.Repository}}:{{.Tag}} {{.ID}}'</code></pre>
<div class="out">nginx:1.27-alpine b4e5c0a1d2f3</div>

<h3>Official images and everything else</h3>
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

<h3>What is actually in there: the manifest</h3>
<pre><code>docker buildx imagetools inspect nginx:1.27-alpine | head -12</code></pre>
<div class="out">Name:      docker.io/library/nginx:1.27-alpine
MediaType: application/vnd.oci.image.index.v1+json
Digest:    sha256:41523187cf7d7a2f2677a80609d9caa14388bf5c1fbca9c410ba3de602aaaab4

Manifests:
  Name:        docker.io/library/nginx:1.27-alpine@sha256:e0f2a3d1b5c9…
  MediaType:   application/vnd.oci.image.manifest.v1+json
  Platform:    linux/amd64

  Name:        docker.io/library/nginx:1.27-alpine@sha256:a71c9f8e4d33…
  MediaType:   application/vnd.oci.image.manifest.v1+json
  Platform:    linux/arm64/v8</div>
<p>One tag, one top-level digest, and <em>several</em> images underneath it — one per platform. This is an <strong>image index</strong> (or "manifest list"), and it is why the same <code>docker pull nginx</code> gives you an x86 image on a server and an ARM image on an M-series Mac. Lesson 3.4 covers what happens when that goes wrong, which it does in exactly one memorable way.</p>
<pre><code>docker image inspect nginx:1.27-alpine \\
  --format 'os={{.Os}} arch={{.Architecture}} layers={{len .RootFS.Layers}} created={{.Created}}'
docker image inspect nginx:1.27-alpine --format '{{json .Config.Labels}}' | tr ',' '\\n' | head -4</code></pre>
<div class="out">os=linux arch=amd64 layers=8 created=2026-08-01T12:04:33Z
{"maintainer":"NGINX Docker Maintainers &lt;docker-maint@nginx.com&gt;"
"org.opencontainers.image.source":"https://github.com/nginxinc/docker-nginx"
"org.opencontainers.image.version":"1.27.2"</div>
<div class="callout ok"><strong>The <code>org.opencontainers.image.*</code> labels are how you find out where an image came from.</strong> <code>image.source</code> points at the repository that built it, <code>image.revision</code> at the exact commit, <code>image.created</code> at the build time. Any image without them is asking you to take its provenance on trust. Chapter 4 shows how to add them to your own images in three lines — and Chapter 11 uses them to answer "which commit is production running?" in one command.</div>

<h3>Reading a tag before you trust it</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">nginx:1.27-alpine</span><span class="v">Minor version pinned, Alpine base. Moves only within 1.27.x patches. A good default: security fixes arrive, breaking changes do not.</span></div>
  <div class="kv"><span class="k">node:22-slim</span><span class="v">Debian-based, but with docs, man pages and extra packages removed. Bigger than Alpine and uses glibc, which avoids a whole class of native-module problems (Chapter 6).</span></div>
  <div class="kv"><span class="k">postgres:16.4</span><span class="v">Fully pinned. Predictable, and it stops receiving patches — you have to bump it yourself. Correct for a database where you want to choose your upgrade moment.</span></div>
  <div class="kv"><span class="k">python:3.12-bookworm</span><span class="v">The Debian release is named in the tag. Useful when a native dependency needs a specific system library version.</span></div>
  <div class="kv"><span class="k">redis:latest</span><span class="v">Whatever the maintainers pushed most recently, which may be a new major version. Fine for a throwaway experiment; a genuine outage waiting to happen in a Compose file (Lesson 3.2).</span></div>
  <div class="kv"><span class="k">someimage:v2-2026-08-22-a1b2c3d</span><span class="v">The shape your own CI should produce: version, date and commit in one string. Sortable, traceable, and it never means two different things.</span></div>
</div>

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
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: read the name</span><span class="lc-sub">Graded exercises: expand five short references to their full form, say which of two similar names is the official image, and find the source repository of an image from its labels alone.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>docker push myregistry:5000/app</code> failing with an authentication error against Docker Hub. Docker decides the first component is a registry only if it contains a dot or a colon, or is <code>localhost</code>. <code>myregistry/app</code> has neither, so it is read as the Hub user <code>myregistry</code> — and you get a login error for an account you do not own. Use <code>localhost:5000/app</code>, <code>registry.internal/app</code>, or an IP. The same rule catches people with <code>minikube/app</code> and <code>k3s/app</code>.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Every image name is <code>registry/namespace/repository:tag</code> with the first three defaulting to <code>docker.io/library</code> and the tag defaulting to <code>latest</code> — so <code>nginx</code> means far more than it says. One tag can point at an index containing several per-platform images, which is why the same command gives different bytes on an ARM laptop and an x86 server. And the <code>org.opencontainers.image.source</code> label is how you find out where an image really came from; an image without it is asking for trust it has not earned.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Đọc một cái tên ảnh</h2>
<p class="lead"><code>nginx</code> trông như một cái tên. Thật ra nó là BỐN trường mà ba trong số đó bị bỏ trống, và Docker điền vào chỗ trống bằng những giá trị mặc định bạn không bao giờ nhìn thấy. Biết mấy mặc định đó là khác biệt giữa "nó kéo về một cái gì đó" với việc biết CHÍNH XÁC bạn sắp chạy cái gì trên máy chủ của mình.</p>

<h3>Bốn phần</h3>
<pre><code><span class="tok-comment"># Dạng đầy đủ, không bỏ sót gì:</span>
docker.io/library/nginx:1.27-alpine
<span class="tok-comment"># ^^^^^^^^ ^^^^^^^ ^^^^^ ^^^^^^^^^^^</span>
<span class="tok-comment"># registry không-gian-tên kho  tag</span>

docker pull nginx:1.27-alpine
docker image inspect nginx:1.27-alpine --format '{{index .RepoTags 0}}'
docker image inspect nginx:1.27-alpine --format '{{index .RepoDigests 0}}'</code></pre>
<div class="out">nginx:1.27-alpine
nginx@sha256:41523187cf7d7a2f2677a80609d9caa14388bf5c1fbca9c410ba3de602aaaab4</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">registry — mặc định là docker.io</span><span class="lz-lnote">Máy chủ phục vụ cái ảnh. <code>ghcr.io</code>, <code>quay.io</code>, <code>registry.gitlab.com</code>, <code>123456.dkr.ecr.ap-southeast-1.amazonaws.com</code>, hay của chính bạn. Docker nhận ra nó vì nó chứa một dấu chấm hoặc một dấu hai chấm, hoặc đúng bằng <code>localhost</code> — đó là lý do <code>myregistry/app</code> không có dấu chấm bị coi là một <em>KHÔNG GIAN TÊN</em> trên Docker Hub, chứ không phải một máy chủ.</span></div>
  <div class="lz-layer"><span class="lz-lname">không gian tên — mặc định là library</span><span class="lz-lnote">Tài khoản hoặc tổ chức. <code>library</code> là không gian tên của chính Docker dành cho ảnh chính thức đã tuyển chọn, và nó là cái duy nhất bạn không bao giờ phải gõ. <code>bitnami/postgresql</code>, <code>cuonghoang1103/api</code> — đó là không gian tên của người dùng.</span></div>
  <div class="lz-layer"><span class="lz-lname">kho — phần DUY NHẤT bắt buộc</span><span class="lz-lnote">Tên của cái thứ đó: <code>nginx</code>, <code>postgres</code>, <code>node</code>. Một kho chứa nhiều tag và nhiều kiến trúc.</span></div>
  <div class="lz-layer"><span class="lz-lname">tag — mặc định là latest</span><span class="lz-lnote">Một cái nhãn cho người đọc, trỏ tới một cái ảnh. Nó là một <strong>CON TRỎ THAY ĐỔI ĐƯỢC</strong>, không phải một phiên bản — Bài 3.2 nói về việc vì sao điều đó quan trọng hơn mọi thứ khác trong chương này.</span></div>
  <div class="lz-layer"><span class="lz-lname">hoặc @digest — thay cho tag</span><span class="lz-lnote"><code>nginx@sha256:4152…</code> gọi tên chính NỘI DUNG. Bất biến theo cấu tạo: cái chuỗi đó chỉ có thể trỏ tới đúng những byte ấy.</span></div>
</div>
<pre><code><span class="tok-comment"># Cả bốn lệnh này kéo về CÙNG một cái ảnh</span>
docker pull nginx:1.27-alpine
docker pull library/nginx:1.27-alpine
docker pull docker.io/nginx:1.27-alpine
docker pull docker.io/library/nginx:1.27-alpine
docker images nginx --format '{{.Repository}}:{{.Tag}} {{.ID}}'</code></pre>
<div class="out">nginx:1.27-alpine b4e5c0a1d2f3</div>

<h3>Ảnh chính thức và mọi thứ còn lại</h3>
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

<h3>Bên trong thật sự có gì: cái manifest</h3>
<pre><code>docker buildx imagetools inspect nginx:1.27-alpine | head -12</code></pre>
<div class="out">Name:      docker.io/library/nginx:1.27-alpine
MediaType: application/vnd.oci.image.index.v1+json
Digest:    sha256:41523187cf7d7a2f2677a80609d9caa14388bf5c1fbca9c410ba3de602aaaab4

Manifests:
  Name:        docker.io/library/nginx:1.27-alpine@sha256:e0f2a3d1b5c9…
  MediaType:   application/vnd.oci.image.manifest.v1+json
  Platform:    linux/amd64

  Name:        docker.io/library/nginx:1.27-alpine@sha256:a71c9f8e4d33…
  MediaType:   application/vnd.oci.image.manifest.v1+json
  Platform:    linux/arm64/v8</div>
<p>Một tag, một digest ở tầng trên, và <em>NHIỀU</em> ảnh nằm bên dưới nó — mỗi nền tảng một cái. Đây là một <strong>CHỈ MỤC ẢNH</strong> (hay "manifest list"), và đó là lý do cùng một lệnh <code>docker pull nginx</code> cho bạn ảnh x86 trên máy chủ và ảnh ARM trên một máy Mac dòng M. Bài 3.4 nói về chuyện gì xảy ra khi việc đó trục trặc, và nó trục trặc theo đúng một kiểu rất đáng nhớ.</p>
<pre><code>docker image inspect nginx:1.27-alpine \\
  --format 'os={{.Os}} arch={{.Architecture}} tầng={{len .RootFS.Layers}} tạo lúc={{.Created}}'
docker image inspect nginx:1.27-alpine --format '{{json .Config.Labels}}' | tr ',' '\\n' | head -4</code></pre>
<div class="out">os=linux arch=amd64 tầng=8 tạo lúc=2026-08-01T12:04:33Z
{"maintainer":"NGINX Docker Maintainers &lt;docker-maint@nginx.com&gt;"
"org.opencontainers.image.source":"https://github.com/nginxinc/docker-nginx"
"org.opencontainers.image.version":"1.27.2"</div>
<div class="callout ok"><strong>Những nhãn <code>org.opencontainers.image.*</code> là cách bạn biết một cái ảnh từ đâu ra.</strong> <code>image.source</code> trỏ tới kho mã đã dựng nó, <code>image.revision</code> tới đúng cái commit, <code>image.created</code> tới thời điểm dựng. Bất kỳ ảnh nào KHÔNG có chúng là đang đòi bạn tin vào xuất xứ của nó mà không có bằng chứng. Chương 4 chỉ cách thêm chúng vào ảnh của chính bạn trong ba dòng — và Chương 11 dùng chúng để trả lời "production đang chạy commit nào?" bằng một câu lệnh.</div>

<h3>Đọc một cái tag trước khi tin nó</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">nginx:1.27-alpine</span><span class="v">Ghim tới bản phụ, nền Alpine. Chỉ dịch chuyển trong phạm vi các bản vá 1.27.x. Một mặc định tốt: bản vá an ninh vẫn tới, thay đổi phá vỡ tương thích thì không.</span></div>
  <div class="kv"><span class="k">node:22-slim</span><span class="v">Nền Debian, nhưng đã gỡ tài liệu, trang man và các gói phụ. Nặng hơn Alpine và dùng glibc, và điều đó tránh được cả một lớp vấn đề với mô-đun native (Chương 6).</span></div>
  <div class="kv"><span class="k">postgres:16.4</span><span class="v">Ghim đầy đủ. Đoán trước được, và nó thôi nhận bản vá — bạn phải tự nâng lên. Đúng cho một cơ sở dữ liệu mà bạn muốn tự chọn thời điểm nâng cấp.</span></div>
  <div class="kv"><span class="k">python:3.12-bookworm</span><span class="v">Bản phát hành Debian được ghi thẳng trong tag. Hữu ích khi một thư viện native cần một phiên bản thư viện hệ thống cụ thể.</span></div>
  <div class="kv"><span class="k">redis:latest</span><span class="v">Bất cứ thứ gì người bảo trì đẩy lên gần nhất, và đó có thể là một phiên bản lớn mới. Ổn cho một thí nghiệm vứt đi; là một sự cố có thật đang chờ sẵn trong một file Compose (Bài 3.2).</span></div>
  <div class="kv"><span class="k">someimage:v2-2026-08-22-a1b2c3d</span><span class="v">Hình hài mà CI của chính bạn nên tạo ra: phiên bản, ngày và commit trong một chuỗi. Sắp xếp được, truy vết được, và nó không bao giờ mang hai nghĩa.</span></div>
</div>

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
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đọc cái tên</span><span class="lc-sub">Bài chấm điểm: khai triển năm tham chiếu ngắn thành dạng đầy đủ, nói xem trong hai cái tên na ná thì cái nào là ảnh chính thức, và tìm ra kho mã nguồn của một ảnh chỉ từ nhãn của nó.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>docker push myregistry:5000/app</code> hỏng với một lỗi xác thực đối với Docker Hub. Docker chỉ coi thành phần đầu tiên là một registry nếu nó chứa dấu chấm hoặc dấu hai chấm, hoặc là <code>localhost</code>. <code>myregistry/app</code> chẳng có cái nào, nên nó bị đọc thành người dùng Hub tên <code>myregistry</code> — và bạn nhận lỗi đăng nhập cho một tài khoản không phải của mình. Hãy dùng <code>localhost:5000/app</code>, <code>registry.internal/app</code>, hoặc một địa chỉ IP. Cùng cái luật đó bẫy những người viết <code>minikube/app</code> và <code>k3s/app</code>.</div>
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
<pre><code>docker pull alpine:3.20
docker tag alpine:3.20 demo:v1
docker images demo --format '{{.Repository}}:{{.Tag}} {{.ID}}'

<span class="tok-comment"># now point the same tag at a completely different image</span>
docker pull busybox:1.36
docker tag busybox:1.36 demo:v1
docker images demo --format '{{.Repository}}:{{.Tag}} {{.ID}}'
docker images -f dangling=true --format '{{.ID}} {{.Repository}}:{{.Tag}}' | head -2</code></pre>
<div class="out">demo:v1 a606584aa9aa
demo:v1 65ad0d468eb1
&lt;none&gt;:&lt;none&gt; a606584aa9aa</div>
<p>Same tag, different image, no warning. The old image did not disappear — it lost its only name and became <strong>dangling</strong>, which is where most of the reclaimable space in <code>docker system df</code> comes from. Nothing about this is a bug: a tag is a pointer, and pointers are meant to move. Upstream maintainers move them deliberately every time they ship a patch.</p>

<h3>What :latest actually means</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">It is a default, not a superlative</span><span class="v"><code>latest</code> is simply the tag name Docker assumes when you do not give one. It has no built-in relationship to time or version numbers.</span></div>
  <div class="kv"><span class="k">It may not be the newest</span><span class="v">Many projects point <code>latest</code> at the newest <em>stable</em> release, so a prerelease is newer. Others stop updating it entirely — a repository can have a <code>latest</code> from 2021 and a <code>3.20</code> from last week.</span></div>
  <div class="kv"><span class="k">It may not exist</span><span class="v">Nothing requires a repository to have one. <code>docker pull someimage</code> then fails with <code>manifest unknown</code>, which reads like the image is missing when only the tag is.</span></div>
  <div class="kv"><span class="k">It can cross a major version</span><span class="v">This is the outage. <code>postgres:latest</code> moved from 16 to 17; your Compose file pulled it on a fresh machine; the data directory is version 16 and the server refuses to start.</span></div>
  <div class="kv"><span class="k">It breaks reproducibility silently</span><span class="v">Two developers, one Compose file, two different Node versions — and the bug only appears on one machine. Nothing in git differs, which is what makes it expensive to find.</span></div>
</div>
<pre><code><span class="tok-comment"># The failure, in three commands</span>
docker pull postgres:latest &gt;/dev/null
docker image inspect postgres:latest --format '{{index .Config.Env 1}}'
<span class="tok-comment"># six months later, on a new machine, the SAME command gives:</span>
<span class="tok-comment"># PG_MAJOR=17  → "database files are incompatible with server"</span></code></pre>
<div class="out">PG_MAJOR=16</div>

<h3>Digests: the immutable name</h3>
<pre><code>docker image inspect nginx:1.27-alpine --format '{{index .RepoDigests 0}}'
docker pull nginx@sha256:41523187cf7d7a2f2677a80609d9caa14388bf5c1fbca9c410ba3de602aaaab4
docker images nginx --format '{{.Repository}}:{{.Tag}} {{.ID}}'</code></pre>
<div class="out">nginx@sha256:41523187cf7d7a2f2677a80609d9caa14388bf5c1fbca9c410ba3de602aaaab4
nginx     1.27-alpine   b4e5c0a1d2f3
nginx     &lt;none&gt;        b4e5c0a1d2f3</div>
<p>The digest is the SHA-256 of the image manifest, so it is a name derived from the content. It cannot be repointed: change one byte and it is a different digest. That makes it the only truly reproducible way to refer to an image, and the registry verifies it on every pull — a corrupted or tampered download fails rather than running.</p>
<div class="lz-map">
  <div class="lz-stage">Use a tag when…</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">You want patches automatically</span><span class="lz-nsub">Development, local experiments, and base images in a Dockerfile you rebuild weekly in CI. <code>node:22-alpine</code> quietly picking up a security fix is a feature.</span></div></div>
  <div class="lz-stage">Use a digest when…</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"The same bytes, everywhere, forever"</span><span class="lz-nsub">Production Compose files, deployment manifests, and any base image where a surprise rebuild would be a bad day. Also required by most supply-chain policies.</span></div></div>
  <div class="lz-stage">Use both</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">tag@digest — readable and pinned</span><span class="lz-nsub"><code>nginx:1.27-alpine@sha256:4152…</code> is legal and is the best form: a human can see the version, the machine uses the digest, and a bot can bump both together.</span></div></div>
</div>
<pre><code><span class="tok-comment"># Pinning in the three places it matters</span>
<span class="tok-comment"># Dockerfile</span>
FROM node:22-alpine@sha256:b8f2c1a4e9d3f7a6b5c4d3e2f1908877665544332211aabbccddeeff0011223344

<span class="tok-comment"># compose.yaml</span>
services:
  db:
    image: postgres:16-alpine@sha256:9a1c8e7d6b5a4f3e2d1c0b9a8f7e6d5c4b3a29180716f5e4d3c2b1a09f8e7d6c

<span class="tok-comment"># and getting the digest to paste, for any image</span>
docker buildx imagetools inspect --format '{{.Manifest.Digest}}' postgres:16-alpine</code></pre>
<div class="out">sha256:9a1c8e7d6b5a4f3e2d1c0b9a8f7e6d5c4b3a29180716f5e4d3c2b1a09f8e7d6c</div>
<div class="callout warn"><strong>There are two kinds of digest and picking the wrong one loses multi-architecture support.</strong> <code>docker buildx imagetools inspect</code> gives you the <em>index</em> digest, which still resolves per-platform — that is the one you want. <code>docker image inspect … .RepoDigests</code> on a machine that already pulled gives the same index digest, but a digest copied out of the <code>Manifests:</code> section of an <code>imagetools</code> listing is a <em>platform-specific</em> manifest, and pinning that means an ARM machine will pull an x86 image and fail with <code>exec format error</code> (Lesson 3.4).</div>

<h3>Keeping pins current</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">The cost of pinning</span><span class="v">A pinned base image stops receiving security updates. That is the whole point, and it is also a liability: an unattended pin from 2024 is a pile of unpatched CVEs. Pinning is a commitment to updating deliberately.</span></div>
  <div class="kv"><span class="k">Renovate / Dependabot</span><span class="v">Both understand <code>FROM image:tag@sha256:…</code> and open a pull request when the tag moves. This is the answer: pinned by default, updated by a bot, reviewed by a human. Set it up once.</span></div>
  <div class="kv"><span class="k">Rebuild on a schedule</span><span class="v">A weekly CI job that rebuilds with <code>--pull</code> catches base-image patches even on tag-pinned builds. Cheap, and it means your image is never more than seven days behind.</span></div>
  <div class="kv"><span class="k">docker scout / trivy</span><span class="v">Scan the image you actually ship and report known CVEs by layer. Chapter 6 covers this properly; the point here is that pinning without scanning is how you freeze a vulnerability in place.</span></div>
</div>

<h3>Tagging your own images</h3>
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
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">One immutable tag per build</span><span class="lz-t">the commit SHA, or version-date-SHA</span><span class="lz-d">Never reused, never repointed. This is what deployments reference, so "what is production running?" always has an exact answer.</span></div>
  <div class="lz-step"><span class="lz-k">Moving aliases for humans</span><span class="lz-t">1.4 · 1 · latest · staging</span><span class="lz-d">Convenient to type and safe to move, because nothing critical points at them. They are bookmarks, not identities.</span></div>
  <div class="lz-step"><span class="lz-k">Deploy by digest or immutable tag</span><span class="lz-t">never by a moving alias</span><span class="lz-d">A rollback then means retagging or redeploying a specific digest — a ten-second operation with a guaranteed outcome.</span></div>
  <div class="lz-step"><span class="lz-k">Record where it came from</span><span class="lz-t">--label org.opencontainers.image.revision=\$GIT_SHA</span><span class="lz-d">So an image found on a server without its tags can still be traced back to a commit (Lesson 3.1).</span></div>
</div>
<pre><code>docker rmi demo:v1 &gt;/dev/null 2&gt;&amp;1; docker image prune -f &gt;/dev/null</code></pre>

<a class="link-card" href="https://docs.docker.com/engine/manage-resources/pull-limits/" target="_blank" rel="noopener">
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
<pre><code>docker pull alpine:3.20
docker tag alpine:3.20 demo:v1
docker images demo --format '{{.Repository}}:{{.Tag}} {{.ID}}'

<span class="tok-comment"># giờ trỏ đúng cái tag đó sang một cái ảnh hoàn toàn khác</span>
docker pull busybox:1.36
docker tag busybox:1.36 demo:v1
docker images demo --format '{{.Repository}}:{{.Tag}} {{.ID}}'
docker images -f dangling=true --format '{{.ID}} {{.Repository}}:{{.Tag}}' | head -2</code></pre>
<div class="out">demo:v1 a606584aa9aa
demo:v1 65ad0d468eb1
&lt;none&gt;:&lt;none&gt; a606584aa9aa</div>
<p>Cùng một tag, ảnh khác nhau, không một lời cảnh báo. Cái ảnh cũ không biến mất — nó mất cái TÊN DUY NHẤT của mình và trở thành <strong>MỒ CÔI</strong> (dangling), và đó là chỗ phần lớn dung lượng thu hồi được trong <code>docker system df</code> đến từ. Chẳng có gì trong chuyện này là một con bọ: một tag là một con trỏ, và con trỏ sinh ra để di chuyển. Người bảo trì ở thượng nguồn cố ý dịch chúng mỗi lần họ phát hành một bản vá.</p>

<h3>:latest thật ra nghĩa là gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó là một MẶC ĐỊNH, không phải một tính từ so sánh nhất</span><span class="v"><code>latest</code> đơn giản là cái tên tag mà Docker giả định khi bạn không đưa cái nào. Nó không có quan hệ dựng sẵn nào với thời gian hay số phiên bản.</span></div>
  <div class="kv"><span class="k">Nó có thể KHÔNG phải cái mới nhất</span><span class="v">Nhiều dự án trỏ <code>latest</code> vào bản phát hành ỔN ĐỊNH mới nhất, nên một bản tiền phát hành thì mới hơn. Số khác thì ngừng cập nhật nó hẳn — một kho có thể có <code>latest</code> từ 2021 và <code>3.20</code> từ tuần trước.</span></div>
  <div class="kv"><span class="k">Nó có thể KHÔNG tồn tại</span><span class="v">Không có gì bắt một kho phải có nó. <code>docker pull someimage</code> khi đó hỏng với <code>manifest unknown</code>, nghe như cái ảnh biến mất trong khi chỉ có cái tag là không có.</span></div>
  <div class="kv"><span class="k">Nó có thể nhảy qua một phiên bản LỚN</span><span class="v">Đây chính là cú sự cố. <code>postgres:latest</code> nhảy từ 16 sang 17; file Compose của bạn kéo nó về trên một cái máy mới; thư mục dữ liệu là bản 16 và máy chủ từ chối khởi động.</span></div>
  <div class="kv"><span class="k">Nó phá khả năng tái lập trong im lặng</span><span class="v">Hai lập trình viên, một file Compose, hai phiên bản Node khác nhau — và con bọ chỉ hiện ra trên một cái máy. Không có gì trong git khác nhau, và đó là thứ khiến nó đắt để tìm ra.</span></div>
</div>
<pre><code><span class="tok-comment"># Cú hỏng, trong ba câu lệnh</span>
docker pull postgres:latest &gt;/dev/null
docker image inspect postgres:latest --format '{{index .Config.Env 1}}'
<span class="tok-comment"># sáu tháng sau, trên một máy mới, CÙNG câu lệnh đó cho ra:</span>
<span class="tok-comment"># PG_MAJOR=17  → "database files are incompatible with server"</span></code></pre>
<div class="out">PG_MAJOR=16</div>

<h3>Digest: cái tên bất biến</h3>
<pre><code>docker image inspect nginx:1.27-alpine --format '{{index .RepoDigests 0}}'
docker pull nginx@sha256:41523187cf7d7a2f2677a80609d9caa14388bf5c1fbca9c410ba3de602aaaab4
docker images nginx --format '{{.Repository}}:{{.Tag}} {{.ID}}'</code></pre>
<div class="out">nginx@sha256:41523187cf7d7a2f2677a80609d9caa14388bf5c1fbca9c410ba3de602aaaab4
nginx     1.27-alpine   b4e5c0a1d2f3
nginx     &lt;none&gt;        b4e5c0a1d2f3</div>
<p>Digest là mã SHA-256 của cái manifest của ảnh, nên nó là một cái tên SUY RA TỪ NỘI DUNG. Không trỏ lại được: đổi một byte là ra một digest khác. Điều đó khiến nó thành cách DUY NHẤT thật sự tái lập được để chỉ tới một cái ảnh, và registry kiểm nó ở mọi lần kéo — một bản tải hỏng hoặc bị can thiệp sẽ BÁO LỖI chứ không chạy.</p>
<div class="lz-map">
  <div class="lz-stage">Dùng tag khi…</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bạn muốn nhận bản vá tự động</span><span class="lz-nsub">Lúc phát triển, thí nghiệm cục bộ, và ảnh nền trong một Dockerfile mà bạn dựng lại hằng tuần trong CI. Việc <code>node:22-alpine</code> lặng lẽ nhận một bản vá an ninh là một TÍNH NĂNG.</span></div></div>
  <div class="lz-stage">Dùng digest khi…</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"Đúng những byte đó, ở mọi nơi, mãi mãi"</span><span class="lz-nsub">File Compose cho production, manifest triển khai, và mọi ảnh nền mà một lần dựng lại bất ngờ sẽ là một ngày tồi tệ. Phần lớn chính sách về chuỗi cung ứng cũng bắt buộc nó.</span></div></div>
  <div class="lz-stage">Dùng cả hai</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">tag@digest — vừa đọc được vừa được ghim</span><span class="lz-nsub"><code>nginx:1.27-alpine@sha256:4152…</code> là hợp lệ và là dạng TỐT NHẤT: người đọc thấy phiên bản, máy dùng digest, và một con bot nâng được cả hai cùng lúc.</span></div></div>
</div>
<pre><code><span class="tok-comment"># Ghim ở ba chỗ có ý nghĩa</span>
<span class="tok-comment"># Dockerfile</span>
FROM node:22-alpine@sha256:b8f2c1a4e9d3f7a6b5c4d3e2f1908877665544332211aabbccddeeff0011223344

<span class="tok-comment"># compose.yaml</span>
services:
  db:
    image: postgres:16-alpine@sha256:9a1c8e7d6b5a4f3e2d1c0b9a8f7e6d5c4b3a29180716f5e4d3c2b1a09f8e7d6c

<span class="tok-comment"># và lấy cái digest để dán, cho ảnh bất kỳ</span>
docker buildx imagetools inspect --format '{{.Manifest.Digest}}' postgres:16-alpine</code></pre>
<div class="out">sha256:9a1c8e7d6b5a4f3e2d1c0b9a8f7e6d5c4b3a29180716f5e4d3c2b1a09f8e7d6c</div>
<div class="callout warn"><strong>Có HAI loại digest và chọn nhầm loại là mất luôn hỗ trợ đa kiến trúc.</strong> <code>docker buildx imagetools inspect</code> cho bạn digest của <em>CHỈ MỤC</em>, cái này vẫn phân giải theo từng nền tảng — đó là cái bạn muốn. <code>docker image inspect … .RepoDigests</code> trên một máy đã kéo ảnh về cũng cho cùng digest chỉ mục ấy, nhưng một digest chép ra từ phần <code>Manifests:</code> trong danh sách của <code>imagetools</code> là một manifest <em>RIÊNG CHO MỘT NỀN TẢNG</em>, và ghim cái đó nghĩa là một máy ARM sẽ kéo về một ảnh x86 rồi hỏng với <code>exec format error</code> (Bài 3.4).</div>

<h3>Giữ cho những cái ghim không lỗi thời</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cái giá của việc ghim</span><span class="v">Một ảnh nền bị ghim thì THÔI nhận cập nhật an ninh. Đó chính là điểm mấu chốt, và nó cũng là một khoản nợ: một cái ghim từ 2024 bị bỏ quên là một đống CVE chưa vá. Ghim là một CAM KẾT sẽ cập nhật một cách có chủ ý.</span></div>
  <div class="kv"><span class="k">Renovate / Dependabot</span><span class="v">Cả hai đều hiểu <code>FROM image:tag@sha256:…</code> và mở một pull request khi cái tag dịch đi. Đây là câu trả lời: mặc định thì ghim, để bot cập nhật, để người review. Dựng một lần là xong.</span></div>
  <div class="kv"><span class="k">Dựng lại theo lịch</span><span class="v">Một công việc CI hằng tuần dựng lại với <code>--pull</code> sẽ bắt được bản vá của ảnh nền ngay cả với những bản dựng ghim theo tag. Rẻ, và nó nghĩa là ảnh của bạn không bao giờ tụt quá bảy ngày.</span></div>
  <div class="kv"><span class="k">docker scout / trivy</span><span class="v">Quét đúng cái ảnh bạn đem đi và báo cáo các CVE đã biết theo từng tầng. Chương 6 nói tử tế về chuyện này; điểm mấu chốt ở đây là ghim mà không quét là cách bạn ĐÔNG CỨNG một lỗ hổng tại chỗ.</span></div>
</div>

<h3>Đặt tag cho ảnh của chính bạn</h3>
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
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Một tag BẤT BIẾN cho mỗi lượt dựng</span><span class="lz-t">mã commit, hoặc phiên bản-ngày-commit</span><span class="lz-d">Không bao giờ dùng lại, không bao giờ trỏ lại. Đây là thứ mà việc triển khai tham chiếu tới, nên "production đang chạy cái gì?" luôn có một câu trả lời chính xác.</span></div>
  <div class="lz-step"><span class="lz-k">Bí danh di chuyển được, cho người đọc</span><span class="lz-t">1.4 · 1 · latest · staging</span><span class="lz-d">Tiện gõ và an toàn khi dịch, vì không có gì quan trọng trỏ vào chúng. Chúng là dấu trang, không phải danh tính.</span></div>
  <div class="lz-step"><span class="lz-k">Triển khai bằng digest hoặc tag bất biến</span><span class="lz-t">đừng bao giờ bằng một bí danh di chuyển được</span><span class="lz-d">Khi đó quay lui chỉ là gắn lại tag hoặc triển khai lại một digest cụ thể — một thao tác mười giây với kết quả chắc chắn.</span></div>
  <div class="lz-step"><span class="lz-k">Ghi lại nó từ đâu ra</span><span class="lz-t">--label org.opencontainers.image.revision=\$GIT_SHA</span><span class="lz-d">Để một cái ảnh tìm thấy trên máy chủ mà không còn tag nào vẫn truy được về một commit (Bài 3.1).</span></div>
</div>
<pre><code>docker rmi demo:v1 &gt;/dev/null 2&gt;&amp;1; docker image prune -f &gt;/dev/null</code></pre>

<a class="link-card" href="https://docs.docker.com/engine/manage-resources/pull-limits/" target="_blank" rel="noopener">
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
sudo apt install -y docker-credential-helpers
printf '{"credsStore":"pass"}\\n' &gt; ~/.docker/config.json
docker login          <span class="tok-comment"># the token now goes to the keychain, not the file</span></code></pre></div>
<div class="kv-grid">
  <div class="kv"><span class="k">--password-stdin, always</span><span class="v"><code>docker login -p "\$TOKEN"</code> puts the token in your shell history, in <code>ps</code> output for every user on the machine, and in CI logs. Piping it in avoids all three, and it is the same number of keystrokes.</span></div>
  <div class="kv"><span class="k">Access tokens, not passwords</span><span class="v">Create them per machine and per purpose. They can be revoked individually, scoped to read-only, and they keep working when you enable 2FA — which a password will not.</span></div>
  <div class="kv"><span class="k">docker logout on shared machines</span><span class="v">Especially CI runners you do not exclusively own. The credential file survives the job otherwise.</span></div>
  <div class="kv"><span class="k">CI has better options</span><span class="v">GitHub Actions gives every workflow a scoped <code>GITHUB_TOKEN</code> that can push to GHCR with no secret to manage; ECR and GCR use short-lived cloud credentials. Prefer those over a long-lived personal token in a secrets store.</span></div>
</div>

<h3>Pushing an image</h3>
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
<div class="kv-grid">
  <div class="kv"><span class="k">Docker Hub</span><span class="v"><code>user/image</code>. Free public repositories, one free private repository, and pull rate limits that matter (below). The default, and increasingly not the best choice for CI.</span></div>
  <div class="kv"><span class="k">GHCR — ghcr.io</span><span class="v"><code>ghcr.io/owner/image</code>. Free for public images, generous for private ones, no meaningful pull limits, and it links to the repository that built it. If your code is on GitHub, this is the path of least resistance.</span></div>
  <div class="kv"><span class="k">Cloud registries</span><span class="v">ECR, Artifact Registry, ACR. Same API; authentication is a cloud credential rather than a password. Right when your deployment target is that cloud.</span></div>
  <div class="kv"><span class="k">Self-hosted</span><span class="v">The <code>registry:2</code> image, Harbor, or Gitea's built-in registry. Full control, no rate limits, and you own the backups and the TLS certificate.</span></div>
</div>

<h3>Pull rate limits</h3>
<pre><code>curl -s "https://auth.docker.io/token?service=registry.docker.io&amp;scope=repository:library/alpine:pull" \\
  | jq -r .token \\
  | { read T; curl -sI -H "Authorization: Bearer \$T" \\
      https://registry-1.docker.io/v2/library/alpine/manifests/latest \\
      | grep -i ratelimit; }</code></pre>
<div class="out">ratelimit-limit: 100;w=21600
ratelimit-remaining: 76;w=21600</div>
<p>Anonymous pulls from Docker Hub are counted <strong>per source IP address</strong> over a rolling window. On a home connection that is generous; on a shared office NAT, a cloud NAT gateway or a CI runner pool it is a shared budget, and the failure mode is <code>toomanyrequests: You have reached your pull rate limit</code> in the middle of a deploy. Docker changes these numbers periodically — the command above reports the limits that apply to you right now, which beats any documentation.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Authenticate, even for public images</span><span class="lz-t">docker login in CI</span><span class="lz-d">An authenticated pull counts against your account rather than the shared IP, which immediately removes the "someone else on this NAT used the quota" failure.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Move your own images off Hub</span><span class="lz-t">ghcr.io, or your cloud's registry</span><span class="lz-d">Your images are the ones you pull most often. Base images from Hub are a much smaller share of the budget.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Run a pull-through cache</span><span class="lz-t">a registry:2 in mirror mode</span><span class="lz-d">One machine pulls from Hub; every other machine pulls from it. Cuts the count to near zero and makes pulls dramatically faster on a slow link — the single biggest win for a team in Vietnam pulling from a US-hosted registry.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Stop pulling what you already have</span><span class="lz-t">avoid --pull=always where it is not needed</span><span class="lz-d">A digest-pinned image never needs re-pulling. Chapter 11's deploy script pulls exactly once per release.</span></div>
</div>

<h3>Your own registry, in one command</h3>
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

<h3>Talking to an insecure registry</h3>
<pre><code><span class="tok-comment"># /etc/docker/daemon.json — for a plain-HTTP registry on a private network</span>
{ "insecure-registries": ["registry.internal:5000"] }</code></pre>
<pre><code>sudo systemctl restart docker
docker info --format '{{json .RegistryConfig.IndexConfigs}}' | tr ',' '\\n' | head -3</code></pre>
<div class="out">{"docker.io":{"Name":"docker.io"
"Mirrors":[]
"Secure":true</div>
<p>Docker refuses plain HTTP by default, which is correct — an unauthenticated HTTP registry can be swapped for a malicious one by anyone on the path. <code>insecure-registries</code> is an explicit, per-host opt-out for a network you control. Note that <code>localhost</code> is exempt automatically, which is why the example above worked without any configuration.</p>
<pre><code>docker rm -f registry &gt;/dev/null; docker volume rm regdata &gt;/dev/null
docker rmi localhost:5000/alpine:3.20 cuonghoang1103/demo:1.0 &gt;/dev/null 2&gt;&amp;1</code></pre>

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
sudo apt install -y docker-credential-helpers
printf '{"credsStore":"pass"}\\n' &gt; ~/.docker/config.json
docker login          <span class="tok-comment"># token giờ vào keychain, không vào file</span></code></pre></div>
<div class="kv-grid">
  <div class="kv"><span class="k">--password-stdin, LUÔN LUÔN</span><span class="v"><code>docker login -p "\$TOKEN"</code> đặt cái token vào lịch sử shell của bạn, vào output <code>ps</code> mà mọi người dùng trên máy đều thấy, và vào log CI. Đổ nó qua ống dẫn tránh được cả ba, và số phím gõ thì bằng nhau.</span></div>
  <div class="kv"><span class="k">Access token, không phải mật khẩu</span><span class="v">Hãy tạo chúng theo từng máy và từng mục đích. Chúng thu hồi được riêng lẻ, giới hạn được thành chỉ-đọc, và chúng vẫn chạy khi bạn bật 2FA — điều mà một mật khẩu thì không.</span></div>
  <div class="kv"><span class="k">docker logout trên máy dùng chung</span><span class="v">Nhất là những máy chạy CI mà bạn không sở hữu độc quyền. Không thì file thông tin đăng nhập sống sót qua cả công việc đó.</span></div>
  <div class="kv"><span class="k">CI có lựa chọn tốt hơn</span><span class="v">GitHub Actions cấp cho mỗi workflow một <code>GITHUB_TOKEN</code> giới hạn phạm vi, đẩy được lên GHCR mà không phải quản lý bí mật nào; ECR và GCR dùng thông tin đăng nhập đám mây ngắn hạn. Hãy ưu tiên chúng hơn một token cá nhân sống lâu nằm trong kho bí mật.</span></div>
</div>

<h3>Đẩy một cái ảnh lên</h3>
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
<div class="kv-grid">
  <div class="kv"><span class="k">Docker Hub</span><span class="v"><code>người_dùng/ảnh</code>. Kho công khai miễn phí, một kho riêng tư miễn phí, và giới hạn tần suất kéo có ảnh hưởng thật (ở dưới). Là mặc định, và ngày càng không phải lựa chọn tốt nhất cho CI.</span></div>
  <div class="kv"><span class="k">GHCR — ghcr.io</span><span class="v"><code>ghcr.io/chủ_sở_hữu/ảnh</code>. Miễn phí cho ảnh công khai, hào phóng với ảnh riêng tư, không có giới hạn kéo đáng kể, và nó liên kết tới kho mã đã dựng ra nó. Nếu mã của bạn nằm trên GitHub thì đây là con đường ít trở lực nhất.</span></div>
  <div class="kv"><span class="k">Registry của đám mây</span><span class="v">ECR, Artifact Registry, ACR. Cùng API; xác thực là một thông tin đăng nhập đám mây chứ không phải mật khẩu. Đúng khi đích triển khai của bạn là chính đám mây đó.</span></div>
  <div class="kv"><span class="k">Tự dựng</span><span class="v">Ảnh <code>registry:2</code>, Harbor, hay registry có sẵn của Gitea. Toàn quyền kiểm soát, không giới hạn tần suất, và bạn tự lo phần sao lưu với chứng chỉ TLS.</span></div>
</div>

<h3>Giới hạn tần suất kéo</h3>
<pre><code>curl -s "https://auth.docker.io/token?service=registry.docker.io&amp;scope=repository:library/alpine:pull" \\
  | jq -r .token \\
  | { read T; curl -sI -H "Authorization: Bearer \$T" \\
      https://registry-1.docker.io/v2/library/alpine/manifests/latest \\
      | grep -i ratelimit; }</code></pre>
<div class="out">ratelimit-limit: 100;w=21600
ratelimit-remaining: 76;w=21600</div>
<p>Những lượt kéo ẩn danh từ Docker Hub được đếm <strong>THEO ĐỊA CHỈ IP NGUỒN</strong> trong một cửa sổ trượt. Trên một đường mạng nhà thì hạn mức đó rộng rãi; trên một cái NAT văn phòng dùng chung, một cổng NAT của đám mây hay một bể máy chạy CI thì đó là một ngân sách CHIA CHUNG, và kiểu hỏng là <code>toomanyrequests: You have reached your pull rate limit</code> ngay giữa một bản deploy. Docker đổi những con số này theo thời gian — câu lệnh ở trên báo cáo đúng giới hạn đang áp cho bạn NGAY LÚC NÀY, và điều đó hơn mọi tài liệu.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Xác thực, kể cả với ảnh công khai</span><span class="lz-t">docker login trong CI</span><span class="lz-d">Một lượt kéo có xác thực được tính vào tài khoản của bạn thay vì cái IP dùng chung, và điều đó lập tức loại bỏ kiểu hỏng "ai đó trên cùng NAT này đã xài hết hạn mức".</span></div>
  <div class="lz-step"><span class="lz-k">2 · Chuyển ảnh của CHÍNH BẠN ra khỏi Hub</span><span class="lz-t">ghcr.io, hoặc registry của đám mây bạn dùng</span><span class="lz-d">Ảnh của bạn mới là thứ bạn kéo nhiều nhất. Ảnh nền từ Hub chiếm phần nhỏ hơn hẳn trong ngân sách.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Chạy một bộ đệm kéo xuyên</span><span class="lz-t">một registry:2 ở chế độ gương</span><span class="lz-d">Một cái máy kéo từ Hub; mọi máy khác kéo từ nó. Cắt số lượt xuống gần bằng không và làm việc kéo nhanh hơn rất nhiều trên đường truyền chậm — thắng lợi lớn nhất cho một đội ở Việt Nam kéo từ một registry đặt tại Mỹ.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Đừng kéo thứ bạn đã có</span><span class="lz-t">tránh --pull=always ở chỗ không cần</span><span class="lz-d">Một ảnh đã ghim digest thì không bao giờ cần kéo lại. Script deploy ở Chương 11 kéo đúng MỘT lần cho mỗi bản phát hành.</span></div>
</div>

<h3>Registry của riêng bạn, bằng một câu lệnh</h3>
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

<h3>Nói chuyện với một registry không bảo mật</h3>
<pre><code><span class="tok-comment"># /etc/docker/daemon.json — cho một registry chạy HTTP thuần trên mạng riêng</span>
{ "insecure-registries": ["registry.internal:5000"] }</code></pre>
<pre><code>sudo systemctl restart docker
docker info --format '{{json .RegistryConfig.IndexConfigs}}' | tr ',' '\\n' | head -3</code></pre>
<div class="out">{"docker.io":{"Name":"docker.io"
"Mirrors":[]
"Secure":true</div>
<p>Docker mặc định TỪ CHỐI HTTP thuần, và điều đó là đúng — một registry HTTP không xác thực có thể bị bất cứ ai trên đường truyền tráo bằng một cái độc hại. <code>insecure-registries</code> là một lối thoát TƯỜNG MINH, theo từng máy chủ, cho một mạng do bạn kiểm soát. Lưu ý <code>localhost</code> được miễn trừ tự động, và đó là lý do ví dụ ở trên chạy được mà không cần cấu hình gì.</p>
<pre><code>docker rm -f registry &gt;/dev/null; docker volume rm regdata &gt;/dev/null
docker rmi localhost:5000/alpine:3.20 cuonghoang1103/demo:1.0 &gt;/dev/null 2&gt;&amp;1</code></pre>

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

<h3>Reading an index</h3>
<pre><code>docker buildx imagetools inspect --raw node:22-alpine \\
  | jq -r '.manifests[] | "\\(.platform.os)/\\(.platform.architecture)\\(.platform.variant // "") \\(.digest[0:19])"'</code></pre>
<div class="out">linux/amd64 sha256:e0f2a3d1b5c9
linux/arm64v8 sha256:a71c9f8e4d33
linux/arm/v7 sha256:c3b2a190f8e7
linux/ppc64le sha256:d5e6f708192a
linux/s390x sha256:f7a6b5c4d3e2
unknown/unknown sha256:1a2b3c4d5e6f</div>
<p>Five real platforms plus an <code>unknown/unknown</code> entry, which is the attestation manifest — build provenance and an SBOM, attached to the index by modern BuildKit. It is not a platform and is skipped when Docker chooses which image to pull.</p>
<pre><code><span class="tok-comment"># What does THIS machine resolve that tag to?</span>
docker pull -q node:22-alpine &gt;/dev/null
docker image inspect node:22-alpine --format '{{.Os}}/{{.Architecture}}'
docker version --format '{{.Server.Arch}}'</code></pre>
<div class="out">linux/amd64
amd64</div>

<h3>--platform, and what it really costs</h3>
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

<h3>Building for both</h3>
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
  <div class="kv"><span class="k">--push is required for multi-platform</span><span class="v">The local image store cannot hold an index of several platforms, so <code>--load</code> fails with <code>docker exporter does not currently support exporting manifest lists</code>. Multi-arch builds go straight to a registry. Build one platform at a time if you need it locally.</span></div>
  <div class="kv"><span class="k">The docker-container driver</span><span class="v">The default <code>docker</code> driver cannot do multi-platform. <code>docker buildx create --driver docker-container</code> gives you a builder that can, running BuildKit in its own container with its own cache.</span></div>
  <div class="kv"><span class="k">Emulated builds are slow</span><span class="v">Building arm64 under QEMU on an x86 runner works and can take twenty minutes. Acceptable for a nightly release build; painful on every commit.</span></div>
  <div class="kv"><span class="k">Native runners are the real answer</span><span class="v">GitHub now offers ARM runners; building each platform on matching hardware in parallel and merging the manifests afterwards is both faster and more reliable than emulation.</span></div>
  <div class="kv"><span class="k">Or cross-compile</span><span class="v">Go, Rust and .NET cross-compile natively. Use the <code>\${TARGETPLATFORM}</code> and <code>\${BUILDPLATFORM}</code> build arguments BuildKit provides, compile on the fast native host, and copy the right binary into a tiny final stage (Chapter 6).</span></div>
</div>
<pre><code><span class="tok-comment"># The cross-compilation shape, for reference — Chapter 6 builds it out</span>
FROM --platform=\${BUILDPLATFORM} golang:1.23 AS build
ARG TARGETOS TARGETARCH
RUN GOOS=\${TARGETOS} GOARCH=\${TARGETARCH} go build -o /app ./cmd/server

FROM alpine:3.20
COPY --from=build /app /app</code></pre>

<h3>Pinning platform where it matters</h3>
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
<p class="note-ct"><strong>Three things to remember.</strong> <code>exec format error</code> always means wrong architecture: compare <code>docker inspect --format '{{.Architecture}}'</code> with <code>uname -m</code> and the diagnosis is done. One tag can be an index of several per-platform images, and <code>docker buildx imagetools inspect</code> is how you see what is really in there. And emulation works but costs 5–20× — build natively or cross-compile for anything you do more than occasionally.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Ảnh đa kiến trúc và lỗi exec format error</h2>
<p class="lead">Một container dùng chung nhân của máy chủ và chạy mã máy NATIVE (Bài 1.1), nên một cái ảnh gắn liền với một kiến trúc. Từ khi Apple chuyển sang ARM còn phần lớn máy chủ vẫn ở x86, chuyện này thôi là mối bận tâm ngách và trở thành câu chuyện "nó dựng ngon lành mà máy chủ từ chối khởi chạy" phổ biến nhất.</p>

<h3>Cú hỏng, đầy đủ</h3>
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

<h3>Đọc một cái chỉ mục</h3>
<pre><code>docker buildx imagetools inspect --raw node:22-alpine \\
  | jq -r '.manifests[] | "\\(.platform.os)/\\(.platform.architecture)\\(.platform.variant // "") \\(.digest[0:19])"'</code></pre>
<div class="out">linux/amd64 sha256:e0f2a3d1b5c9
linux/arm64v8 sha256:a71c9f8e4d33
linux/arm/v7 sha256:c3b2a190f8e7
linux/ppc64le sha256:d5e6f708192a
linux/s390x sha256:f7a6b5c4d3e2
unknown/unknown sha256:1a2b3c4d5e6f</div>
<p>Năm nền tảng thật cộng một mục <code>unknown/unknown</code>, và cái đó là manifest chứng thực — xuất xứ bản dựng và một SBOM, do BuildKit hiện đại đính kèm vào chỉ mục. Nó không phải một nền tảng và bị bỏ qua khi Docker chọn xem phải kéo ảnh nào.</p>
<pre><code><span class="tok-comment"># CÁI MÁY NÀY phân giải cái tag đó ra thành gì?</span>
docker pull -q node:22-alpine &gt;/dev/null
docker image inspect node:22-alpine --format '{{.Os}}/{{.Architecture}}'
docker version --format '{{.Server.Arch}}'</code></pre>
<div class="out">linux/amd64
amd64</div>

<h3>--platform, và cái giá thật của nó</h3>
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

<h3>Dựng cho cả hai</h3>
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
  <div class="kv"><span class="k">--push là BẮT BUỘC với đa nền tảng</span><span class="v">Kho ảnh cục bộ không chứa được một chỉ mục nhiều nền tảng, nên <code>--load</code> hỏng với <code>docker exporter does not currently support exporting manifest lists</code>. Dựng đa kiến trúc thì đi thẳng lên registry. Hãy dựng từng nền tảng một nếu bạn cần nó ở máy.</span></div>
  <div class="kv"><span class="k">Trình điều khiển docker-container</span><span class="v">Trình <code>docker</code> mặc định KHÔNG làm được đa nền tảng. <code>docker buildx create --driver docker-container</code> cho bạn một bộ dựng làm được, chạy BuildKit trong container riêng của nó với bộ đệm riêng.</span></div>
  <div class="kv"><span class="k">Dựng bằng mô phỏng thì chậm</span><span class="v">Dựng arm64 dưới QEMU trên một máy chạy CI x86 thì được và có thể mất hai mươi phút. Chấp nhận được với một bản dựng phát hành hằng đêm; đau đớn nếu chạy ở mọi commit.</span></div>
  <div class="kv"><span class="k">Máy chạy NATIVE mới là câu trả lời thật</span><span class="v">GitHub giờ có máy chạy ARM; dựng mỗi nền tảng trên đúng phần cứng của nó SONG SONG rồi ghép manifest lại vừa nhanh hơn vừa đáng tin hơn mô phỏng.</span></div>
  <div class="kv"><span class="k">Hoặc biên dịch chéo</span><span class="v">Go, Rust và .NET biên dịch chéo được một cách tự nhiên. Hãy dùng các tham số dựng <code>\${TARGETPLATFORM}</code> và <code>\${BUILDPLATFORM}</code> mà BuildKit cung cấp, biên dịch trên máy native nhanh, rồi chép đúng cái chương trình vào một stage cuối tí hon (Chương 6).</span></div>
</div>
<pre><code><span class="tok-comment"># Hình hài của biên dịch chéo, để tham khảo — Chương 6 dựng nó ra đầy đủ</span>
FROM --platform=\${BUILDPLATFORM} golang:1.23 AS build
ARG TARGETOS TARGETARCH
RUN GOOS=\${TARGETOS} GOARCH=\${TARGETARCH} go build -o /app ./cmd/server

FROM alpine:3.20
COPY --from=build /app /app</code></pre>

<h3>Ghim nền tảng ở những chỗ có ý nghĩa</h3>
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
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> <code>exec format error</code> LUÔN nghĩa là sai kiến trúc: so <code>docker inspect --format '{{.Architecture}}'</code> với <code>uname -m</code> là xong phần chẩn đoán. Một cái tag có thể là một CHỈ MỤC gồm nhiều ảnh theo từng nền tảng, và <code>docker buildx imagetools inspect</code> là cách bạn nhìn thấy bên trong đó thật sự có gì. Và mô phỏng thì chạy được nhưng tốn 5–20 lần — hãy dựng native hoặc biên dịch chéo cho bất cứ thứ gì bạn làm thường xuyên hơn thi thoảng.</p>
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
  <div class="kv"><span class="k">Build Cache</span><span class="v">BuildKit's layer cache. Grows with every build, and is <em>100% reclaimable</em> by definition — deleting it only costs you a slower next build. This is the first thing to clear and the one that most often is not.</span></div>
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

<h3>The cleanup ladder</h3>
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
<p>16.6GB from three zero-risk commands. That is the usual shape: most of what accumulates is cache and dangling layers, and clearing it requires no judgement at all.</p>

<h3>Filters, so you keep what matters</h3>
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

<h3>Volumes deserve their own paragraph</h3>
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

<h3>Automate the safe part</h3>
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

<div class="pitfall"><strong>Pitfall:</strong> <code>docker system prune -a --volumes</code> as a reflex when a disk fills. It removes every unused image, every stopped container, every network — and <strong>every volume not currently attached to a running container</strong>. If your database container happened to be stopped at that moment, or its volume was anonymous, the data is gone, with no confirmation beyond a generic <code>y/N</code> that does not name what it is about to delete. There is no undo. Run the ladder above in order, never add <code>--volumes</code> to an automated job, and take a backup before any cleanup on a machine holding data you cannot recreate.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Build cache and dangling images are usually most of the problem and are risk-free to delete, so <code>docker builder prune</code> and <code>docker image prune</code> come first, always. <code>-a</code> removes images no <em>running</em> container uses, which on a server includes the release you would roll back to — use <code>--filter until=</code> with a window wider than your rollback horizon. And never automate volume pruning: name your volumes, look inside before deleting, and remember that an anonymous volume with a random name is quite often somebody's database.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Giữ cho /var/lib/docker khỏi nuốt cả cái đĩa</h2>
<p class="lead">Docker KHÔNG BAO GIỜ tự xoá thứ gì. Mọi cái ảnh bạn từng kéo về, mọi tầng dựng trung gian, mọi container đã dừng và mọi volume vô danh đều nằm lại cho tới khi có thứ gì đó gỡ chúng đi — và trên một máy chủ dựng với deploy đều đặn thì đó là hàng chục gigabyte mỗi tháng. Một cái đĩa đầy kéo theo cả cơ sở dữ liệu, nên chuyện này đáng bỏ hai mươi phút NGAY BÂY GIỜ.</p>

<h3>Chỗ trống thật ra nằm ở đâu</h3>
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
  <div class="kv"><span class="k">Build Cache</span><span class="v">Bộ đệm tầng của BuildKit. Phình lên ở mỗi lượt dựng, và theo định nghĩa là <em>thu hồi được 100%</em> — xoá nó chỉ khiến lượt dựng kế tiếp chậm hơn. Đây là thứ đầu tiên nên dọn và là thứ hay bị bỏ quên nhất.</span></div>
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

<h3>Cái thang dọn dẹp</h3>
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
<p>16,6GB từ ba câu lệnh không rủi ro. Đó là hình hài thường gặp: phần lớn thứ tích tụ lại là bộ đệm và tầng mồ côi, và dọn nó đi hoàn toàn không cần phán đoán gì.</p>

<h3>Bộ lọc, để bạn giữ lại thứ đáng giữ</h3>
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

<h3>Volume xứng đáng một đoạn riêng</h3>
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

<h3>Tự động hoá phần AN TOÀN</h3>
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

<div class="pitfall"><strong>Bẫy:</strong> <code>docker system prune -a --volumes</code> như một phản xạ khi đĩa đầy. Nó gỡ mọi ảnh không dùng, mọi container đã dừng, mọi mạng — và <strong>MỌI VOLUME không đang gắn vào một container đang chạy</strong>. Nếu container cơ sở dữ liệu của bạn tình cờ đang dừng lúc đó, hoặc volume của nó là vô danh, thì dữ liệu biến mất, không có xác nhận nào ngoài một câu <code>y/N</code> chung chung chẳng gọi tên thứ nó sắp xoá. Không có hoàn tác. Hãy chạy cái thang ở trên theo thứ tự, đừng bao giờ thêm <code>--volumes</code> vào một công việc tự động, và hãy sao lưu trước mọi lần dọn dẹp trên một cái máy giữ dữ liệu bạn không tạo lại được.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Bộ đệm dựng và ảnh mồ côi thường là phần lớn vấn đề và xoá chúng không rủi ro, nên <code>docker builder prune</code> với <code>docker image prune</code> đi trước, luôn luôn. <code>-a</code> gỡ những ảnh không container ĐANG CHẠY nào dùng, mà trên máy chủ thì điều đó bao gồm cả bản phát hành bạn định quay lui về — hãy dùng <code>--filter until=</code> với một cửa sổ rộng hơn chân trời quay lui. Và ĐỪNG BAO GIỜ tự động hoá việc tỉa volume: hãy đặt tên cho volume, nhìn vào bên trong trước khi xoá, và nhớ rằng một volume vô danh mang tên ngẫu nhiên rất thường là cơ sở dữ liệu của một ai đó.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.6 ─────────────────────────── */
    {
      title: '3.6 — Quiz: images & registries|||3.6 — Kiểm tra: image & registry',
      slug: 'dk-3-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về mặc định trong tên ảnh, :latest, digest, Mounted from, giới hạn tần suất, exec format error, --push với đa nền tảng, và system prune -a.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on names, tags, registries and disk. Several of these are the direct cause of real outages, so it is worth being certain.</p>
<div class="callout ok">Aim for 7/8. The three that matter most: why <code>:latest</code> breaks reproducibility (3.2), what <code>exec format error</code> always means (3.4), and what <code>system prune -a</code> takes away on a production host (3.5).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về tên, tag, registry và đĩa. Vài câu trong số này là nguyên nhân trực tiếp của những sự cố có thật, nên đáng để chắc chắn.</p>
<div class="callout ok">Hãy nhắm 7/8. Ba câu quan trọng nhất: vì sao <code>:latest</code> phá khả năng tái lập (bài 3.2), <code>exec format error</code> LUÔN nghĩa là gì (bài 3.4), và <code>system prune -a</code> lấy đi cái gì trên một máy chủ production (bài 3.5).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does the short name nginx expand to in full?|||Cái tên ngắn nginx khai triển đầy đủ ra thành gì?',
            options: [
              'nginx:stable on whichever registry you last logged into|||nginx:stable trên registry bạn đăng nhập gần nhất',
              'docker.io/library/nginx:latest — registry, namespace and tag all have defaults|||docker.io/library/nginx:latest — registry, không gian tên và tag đều có giá trị mặc định',
              'hub.docker.com/nginx/nginx:latest|||hub.docker.com/nginx/nginx:latest',
              'It is ambiguous and Docker asks you to be explicit|||Nó mập mờ và Docker sẽ yêu cầu bạn ghi rõ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A Compose file says image: postgres:latest. Six months later a colleague clones the repo and the database will not start. Why?|||Một file Compose ghi image: postgres:latest. Sáu tháng sau một đồng nghiệp clone kho về và cơ sở dữ liệu không khởi động được. Vì sao?',
            options: [
              'The image was deleted from Docker Hub|||Ảnh đó đã bị xoá khỏi Docker Hub',
              'latest is a mutable pointer, not a version — it has since moved to a new major release, and the existing data directory belongs to the old one|||latest là một con trỏ thay đổi được, không phải một phiên bản — từ đó tới nay nó đã dịch sang một bản phát hành lớn mới, còn thư mục dữ liệu đang có thì thuộc về bản cũ',
              'Compose caches images for six months|||Compose lưu đệm ảnh trong sáu tháng',
              'The colleague needs to run docker login first|||Đồng nghiệp đó cần chạy docker login trước',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is image:tag@sha256:... considered the best form for a production reference?|||Vì sao image:tag@sha256:... được coi là dạng tốt nhất cho một tham chiếu trên production?',
            options: [
              'It downloads faster because the digest is pre-computed|||Nó tải nhanh hơn vì digest đã được tính sẵn',
              'The tag stays readable for humans while the digest names the exact content and cannot be repointed — and a bot can update both together|||Cái tag vẫn đọc được cho người trong khi digest gọi tên đúng nội dung và không trỏ lại được — và một con bot cập nhật được cả hai cùng lúc',
              'It bypasses Docker Hub rate limits|||Nó đi vòng qua giới hạn tần suất của Docker Hub',
              'It is required by docker compose v2|||docker compose v2 bắt buộc phải dùng nó',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'During docker push you see "Mounted from library/alpine" instead of an upload. What happened?|||Trong lúc docker push bạn thấy "Mounted from library/alpine" thay cho một lượt tải lên. Chuyện gì đã xảy ra?',
            options: [
              'The push failed and fell back to a mount|||Lượt push hỏng và lùi về một cú mount',
              'The registry already stores that exact layer (layers are content-addressed), so only your own new layers had to be uploaded|||Registry ĐÃ CÓ đúng cái tầng đó (tầng được định danh theo nội dung), nên chỉ những tầng mới của riêng bạn cần tải lên',
              'Your image was linked to the alpine repository|||Ảnh của bạn được liên kết vào kho alpine',
              'It means the layer will be deleted when alpine is updated|||Nó nghĩa là cái tầng đó sẽ bị xoá khi alpine được cập nhật',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your CI pipeline suddenly fails with "toomanyrequests: You have reached your pull rate limit". What is the first fix?|||Quy trình CI của bạn đột nhiên hỏng với "toomanyrequests: You have reached your pull rate limit". Cách chữa đầu tiên là gì?',
            options: [
              'Retry the job; the limit resets in a few seconds|||Chạy lại công việc; giới hạn đặt lại sau vài giây',
              'Authenticate — anonymous pulls are counted per source IP, so a shared CI or office NAT burns a common quota; docker login makes the pulls count against your account|||Hãy XÁC THỰC — lượt kéo ẩn danh được đếm theo IP nguồn, nên một hệ CI dùng chung hay một NAT văn phòng đốt chung một hạn mức; docker login khiến các lượt kéo tính vào tài khoản của bạn',
              'Switch every image to :latest|||Đổi mọi ảnh sang :latest',
              'Add --pull=always to force a fresh download|||Thêm --pull=always để ép tải lại từ đầu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A container fails immediately with "exec format error". What does that always mean?|||Một container hỏng ngay lập tức với "exec format error". Điều đó LUÔN nghĩa là gì?',
            options: [
              'The entrypoint script is missing its execute bit|||Script entrypoint thiếu bit thực thi',
              'The image is built for a different CPU architecture than the host — compare docker inspect --format {{.Architecture}} with uname -m|||Ảnh được dựng cho một kiến trúc CPU khác với máy chủ — hãy so docker inspect --format {{.Architecture}} với uname -m',
              'The image layers are corrupted and need re-pulling|||Các tầng của ảnh bị hỏng và cần kéo lại',
              'The container ran out of memory during startup|||Container hết bộ nhớ trong lúc khởi động',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'docker buildx build --platform linux/amd64,linux/arm64 --load fails. Why?|||docker buildx build --platform linux/amd64,linux/arm64 --load hỏng. Vì sao?',
            options: [
              'The builder needs --privileged|||Bộ dựng cần --privileged',
              'The local image store cannot hold a multi-platform index, so multi-platform builds must go to a registry with --push|||Kho ảnh cục bộ không chứa được một chỉ mục đa nền tảng, nên dựng đa nền tảng phải đi lên registry bằng --push',
              'linux/arm64 must be written as linux/arm64/v8|||linux/arm64 phải viết là linux/arm64/v8',
              'You can only build one platform per Dockerfile|||Mỗi Dockerfile chỉ dựng được một nền tảng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is docker system prune -a risky on a production server, beyond the obvious?|||Ngoài cái hiển nhiên ra, vì sao docker system prune -a lại rủi ro trên một máy chủ production?',
            options: [
              'It stops running containers while it works|||Nó dừng các container đang chạy trong lúc làm việc',
              'It removes every image not used by a RUNNING container — including the previous release you would redeploy to roll back, turning a ten-second rollback into a registry pull|||Nó gỡ MỌI ảnh không được một container ĐANG CHẠY dùng — gồm cả bản phát hành trước mà bạn sẽ triển khai lại để quay lui, biến một cú quay lui mười giây thành một lượt kéo từ registry',
              'It rewrites /etc/docker/daemon.json|||Nó ghi đè /etc/docker/daemon.json',
              'It always deletes named volumes|||Nó luôn xoá cả những volume có tên',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
